// server/routes/userRoutes.js

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// This route shows the registration page
router.get('/register', userController.showRegisterPage);

// This new route handles the form submission
router.post('/register', userController.registerUser);

module.exports = router;