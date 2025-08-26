const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// When a GET request is made to '/register', call the showRegisterPage function
router.get('/register', userController.showRegisterPage);

module.exports = router;