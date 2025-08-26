const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

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

// Tell the app to use the userRoutes for any URL starting with '/users'
app.use('/users', userRoutes);
app.get('/', (req, res) => {
    // This will automatically send the user to the registration page
    res.redirect('/users/register');
});

app.listen(PORT, () => {
    console.log(`Server is running successfully on http://localhost:${PORT}`);
});