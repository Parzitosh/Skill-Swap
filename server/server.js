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

const User = require('./models/User'); // We'll need this later
const Message = require('./models/Message'); // And this

const userRoutes = require('./routes/userRoutes');

const app = express();
const server = http.createServer(app); // Create an HTTP server from the Express app
const io = new Server(server); // Initialize Socket.IO on the server

const PORT = 3000;

// Middleware setup...
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 },
});
app.use(sessionMiddleware);
io.use((socket, next) => {
    sessionMiddleware(socket.request, {}, next);
});

// Routes
app.get('/', (req, res) => res.redirect('/users/login'));
app.use('/users', userRoutes);

// --- Socket.IO Connection Logic ---
io.on('connection', (socket) => {
    console.log('A user connected to Socket.IO');

    const userId = socket.request.session.userId; // Get user ID from session

    socket.on('joinRoom', ({ room }) => {
        socket.join(room);
        console.log(`User ${userId} joined room: ${room}`);
    });

    socket.on('chatMessage', async ({ room, message }) => {
        if (!userId) {
            return console.log('Cannot send message: User not authenticated');
        }
        
        try {
            // 1. Save the message to the database
            const newMessage = new Message({
                room: room,
                sender: userId,
                text: message,
            });
            await newMessage.save();

            // 2. Get the sender's details to display their name
            const user = await User.findById(userId);

            // 3. Broadcast the message object to the room
            io.to(room).emit('message', {
                text: message,
                sender: { name: user.name },
                createdAt: new Date().toLocaleTimeString(),
            });
        } catch (error) {
            console.error('Error handling chat message:', error);
        }
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