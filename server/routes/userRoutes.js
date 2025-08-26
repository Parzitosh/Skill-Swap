// server/routes/userRoutes.js

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// This route shows the registration page
router.get('/register', userController.showRegisterPage);

// This new route handles the form submission
router.post('/register', userController.registerUser);

// Show the login page
router.get('/login', userController.showLoginPage);

// Handle the login form submission
router.post('/login', userController.loginUser);

// Profile page route
router.get('/profile', userController.showProfilePage);

// Logout route
router.get('/logout', userController.logoutUser);

module.exports = router;