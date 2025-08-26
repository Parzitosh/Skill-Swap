// server/controllers/userController.js

const User = require('../models/User');
const bcrypt = require('bcryptjs'); // Import bcrypt

const showRegisterPage = (req, res) => {
    res.render('register', { title: 'Register' });
};

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).send('User with this email already exists.');
        }

        // --- HASHING LOGIC ---
        // 1. Generate a salt
        const salt = await bcrypt.genSalt(10);
        // 2. Hash the password with the salt
        const hashedPassword = await bcrypt.hash(password, salt);
        // --- END HASHING LOGIC ---

        // Create a new user instance with the HASHED password
        const newUser = new User({
            name,
            email,
            password: hashedPassword, // Save the hashed password
        });

        await newUser.save();

        res.status(201).send('User registered successfully! You can now log in.');

    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).send('Server error during registration.');
    }
};

const showLoginPage = (req, res) => {
    res.render('login');
};

const loginUser = (req, res) => {
    const { email, password } = req.body;
    console.log('Login attempt with:', { email, password });
    res.send('Login attempt received. We will validate this in the next step.');
};

// Update module.exports to include the new functions
module.exports = {
    showRegisterPage,
    registerUser,
    showLoginPage,
    loginUser,
};

module.exports = {
    showRegisterPage,
    registerUser,
    showLoginPage,
    loginUser,
};
