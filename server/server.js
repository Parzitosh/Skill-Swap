// server/server.js
const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const session = require('express-session');
const http = require('http'); // Import http
const { Server } = require('socket.io'); // Import Server from socket.io

// Load environment variables and connect to DB
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
connectDB();

const userRoutes = require('./routes/userRoutes');

const app = express();
const server = http.createServer(app); // Create an HTTP server from the Express app
const io = new Server(server); // Initialize Socket.IO on the server

const PORT = 3000;

// Middleware setup...
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 },
}));

// Routes
app.get('/', (req, res) => res.redirect('/users/login'));
app.use('/users', userRoutes);

// --- Socket.IO Connection Logic ---
io.on('connection', (socket) => {
    console.log('A user connected to Socket.IO');

    socket.on('joinRoom', ({ room }) => {
        socket.join(room);
        console.log(`User joined room: ${room}`);
    });

    socket.on('chatMessage', ({ room, message }) => {
        // Broadcast the message to everyone in the specific room
        io.to(room).emit('message', message);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});
// --- End Socket.IO Logic ---


// Change app.listen to server.listen
server.listen(PORT, () => {
    console.log(`Server is running successfully on http://localhost:${PORT}`);
});