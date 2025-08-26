const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const session = require('express-session');

require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });
console.log('My MONGO_URI is:', process.env.MONGO_URI);

// Now, process.env.MONGO_URI will be available for this function
connectDB();

// Import the user routes
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// middleware to parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// Session Middleware Configuration
app.use(session({
    secret: process.env.SESSION_SECRET, // Use the secret from .env
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60, // Cookie expires in 1 hour
    },
}));

// Tell the app to use the userRoutes for any URL starting with '/users'
app.use('/users', userRoutes);
app.get('/', (req, res) => {
    res.redirect('/users/login');
});

app.listen(PORT, () => {
    console.log(`Server is running successfully on http://localhost:${PORT}`);
});