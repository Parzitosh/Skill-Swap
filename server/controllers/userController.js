// server/controllers/userController.js
const User = require('../models/User'); // Import the User model

const showRegisterPage = (req, res) => {
    res.render('register', { title: 'Register' });
};

// Update the registerUser function to be asynchronous
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if user already exists
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).send('User with this email already exists.');
        }

        // Create a new user instance
        const newUser = new User({
            name,
            email,
            password, // Note: We'll hash this later for security
        });

        // Save the user to the database
        await newUser.save();

        res.status(201).send('User registered successfully! You can now log in.');

    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).send('Server error during registration.');
    }
};

module.exports = {
    showRegisterPage,
    registerUser,
};