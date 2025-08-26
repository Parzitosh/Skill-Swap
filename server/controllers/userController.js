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

        // Create a session for the user
        req.session.userId = user._id;

        // Redirect to a new profile page
        res.redirect('/users/profile');

    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send('Server error during login.');
    }
};

const showProfilePage = async (req, res) => {
    try {
        // Find the user by the ID stored in the session
        const user = await User.findById(req.session.userId);

        if (!user) {
            // If no user is found, redirect to login
            return res.redirect('/users/login');
        }

        //debugging line
        console.log('User data being sent to profile page:', user);

        // Render the profile page and pass the user object to it
        res.render('profile', { user: user });

    } catch (error) {
        console.error("Error fetching user for profile:", error);
        res.status(500).send('Server Error');
    }
};
const logoutUser = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/users/profile');
        }
        res.clearCookie('connect.sid'); // Clears the session cookie
        res.redirect('/users/login');
    });
};

const addSkillOffered = async (req, res) => {
    try {
        const user = await User.findById(req.session.userId);
        user.skillsOffered.push(req.body.skill); // Add the new skill to the array
        await user.save(); // Save the updated user document
        res.redirect('/users/profile'); // Redirect back to the profile
    } catch (error) {
        res.status(500).send('Server Error');
    }
};

const addSkillNeeded = async (req, res) => {
    try {
        const user = await User.findById(req.session.userId);
        user.skillsNeeded.push(req.body.skill);
        await user.save();
        res.redirect('/users/profile');
    } catch (error) {
        res.status(500).send('Server Error');
    }
};

module.exports = {
    showRegisterPage,
    registerUser,
    showLoginPage,
    loginUser,
    showProfilePage,
    logoutUser,
    addSkillOffered,
    addSkillNeeded,
};