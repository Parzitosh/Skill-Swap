// server/server.js
const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const session = require('express-session');
const http = require('http'); // Import http
const { Server } = require('socket.io'); // Import Server from socket.io
const { fetchNotifications } = require('./middleware/authMiddleware');

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
app.use(fetchNotifications);

io.use((socket, next) => {
    sessionMiddleware(socket.request, {}, next);
});

// Routes
app.get('/', (req, res) => res.redirect('/users/login'));
app.use('/users', userRoutes);

// --- Socket.IO Connection Logic ---
io.on('connection', (socket) => {
    console.log('--- A user connected to Socket.IO ---');

    // DEBUG LOG 1: Check the user ID from the session when the connection starts.
    const userId = socket.request.session.userId;
    console.log(`[Socket Connection] User ID from session is: ${userId}`);

    socket.on('joinRoom', ({ room }) => {
        socket.join(room);
        console.log(`[Socket Join] User ${userId} joined room: ${room}`);
    });

    socket.on('chatMessage', async ({ room, message }) => {
        if (!userId) {
            return console.log('[Socket Chat] ERROR: Cannot send message, user is not authenticated.');
        }

        try {
            const newMessage = new Message({ room, sender: userId, text: message });
            await newMessage.save();

            // DEBUG LOG 2: Check the user object right after we fetch it from the database.
            const user = await User.findById(userId);
            console.log('[Socket Chat] Fetched user object from DB:', user);

            if (!user) {
                return console.log('[Socket Chat] ERROR: Sender not found in database.');
            }

            // Create the plain object for sending
            const senderInfo = {
                name: user.name,
                _id: user._id.toString()
            };

            // DEBUG LOG 3: Check the final object just before it's sent.
            console.log('[Socket Chat] Broadcasting this senderInfo object:', senderInfo);

            io.to(room).emit('message', {
                text: message,
                sender: senderInfo,
                createdAt: new Date().toLocaleTimeString(),
            });
        } catch (error) {
            console.error('[Socket Chat] CRITICAL ERROR:', error);
        }
    });

    socket.on('disconnect', () => {
        console.log('--- User disconnected ---');
    });
});
// --- End Socket.IO Logic ---


// Change app.listen to server.listen
server.listen(PORT, () => {
    console.log(`Server is running successfully on http://localhost:${PORT}`);
});