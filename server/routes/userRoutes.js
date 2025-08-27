// server/routes/userRoutes.js

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// This route shows the registration page
router.get('/register', userController.showRegisterPage);

// This new route handles the form submission
router.post('/register', userController.registerUser);

// Show the login page
router.get('/login', userController.showLoginPage);

// Handle the login form submission
router.post('/login', userController.loginUser);

// --- Protected Routes ---
// The 'protect' middleware will run before the controller function for these routes.
router.get('/dashboard', protect, userController.showDashboard);
router.get('/profile', protect, userController.showProfilePage);
router.post('/profile/add-skill-offered', protect, userController.addSkillOffered);
router.post('/profile/add-skill-needed', protect, userController.addSkillNeeded);

// Logout route
router.get('/logout', userController.logoutUser);

router.post('/request/:id', protect, userController.sendRequest);

router.get('/requests', protect, userController.showRequestsPage);

router.post('/requests/:id/accept', protect, userController.acceptRequest);

router.post('/requests/:id/reject', protect, userController.rejectRequest);

router.get('/requests/:id/chat', protect, userController.showChatPage);

// Route for updating profile details
router.post('/profile/update', protect, userController.updateProfile);

// Route for submitting a review
router.post('/review/:revieweeId/:requestId', protect, userController.submitReview);

// Route for viewing a public user profile
router.get('/view/:id', protect, userController.showPublicProfile);

// Route for adding/removing from wishlist
router.post('/wishlist/toggle/:id', protect, userController.toggleWishlist);

router.get('/wishlist', protect, userController.showWishlist);

module.exports = router;