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

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Find the user by email
        const user = await User.findOne({ email });

        if (!user) {
            // If no user is found with that email
            return res.status(400).send('Invalid email or password.');
        }

        // 2. Compare the submitted password with the hashed password in the database 🔑
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            // If the passwords do not match
            return res.status(400).send('Invalid email or password.');
        }

        // If login is successful
        res.status(200).send('Login successful! Welcome back.');

    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send('Server error during login.');
    }
};


module.exports = {
    showRegisterPage,
    registerUser,
    showLoginPage,
    loginUser,
};