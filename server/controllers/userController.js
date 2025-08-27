// server/controllers/userController.js

const User = require('../models/User');
const bcrypt = require('bcryptjs'); // Import bcrypt
const Request = require('../models/Request'); // Import the new Request model
const Message = require('../models/Message');
const Review = require('../models/Review');

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
    res.render('login', { title: 'Login' })
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

        // Redirect to a dashboard
        res.redirect('/users/dashboard');

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
        res.render('profile', { title: 'My Profile', user: user });

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

const showDashboard = async (req, res) => {
    try {
        // The base query to find all users except the current one
        const query = { _id: { $ne: req.session.userId } };

        // Check if there is a search term in the URL (e.g., /dashboard?search=Python)
        if (req.query.search) {
            // If there is a search term, add a condition to our query.
            // This will search for users where the 'skillsOffered' array contains the search term.
            // The '$regex' and '$options: "i"' make the search case-insensitive.
            query.skillsOffered = { $regex: req.query.search, $options: "i" };
        }

        // Execute the query to find all users to display
        const users = await User.find(query);
        
        // Fetch the data for the currently logged-in user
        const currentUser = await User.findById(req.session.userId);

        // Render the dashboard and pass all necessary data to the view
        res.render('dashboard', { 
            title: 'Dashboard', 
            users: users,
            searchQuery: req.query.search || '',
            currentUser: currentUser // Pass the current user's data
        });
    } catch (error) {
        res.status(500).send('Server Error');
    }
};

const sendRequest = async (req, res) => {
    try {
        const newRequest = new Request({
            fromUser: req.session.userId,
            toUser: req.params.id, // The ID of the user we are sending the request to
        });
        await newRequest.save();
        res.redirect('/users/dashboard');
    } catch (error) {
        res.status(500).send('Server Error');
    }
};

const showRequestsPage = async (req, res) => {
    try {
        const receivedRequests = await Request.find({ toUser: req.session.userId }).populate('fromUser', 'name');
        const sentRequests = await Request.find({ fromUser: req.session.userId }).populate('toUser', 'name');
        res.render('requests', { title: 'My Requests', receivedRequests, sentRequests });
    } catch (error) {
        res.status(500).send('Server Error');
    }
};

const acceptRequest = async (req, res) => {
    try {
        await Request.findOneAndUpdate({ _id: req.params.id, toUser: req.session.userId }, { status: 'accepted' });
        res.redirect('/users/requests');
    } catch (error) {
        res.status(500).send('Server Error');
    }
};

const rejectRequest = async (req, res) => {
    try {
        await Request.findOneAndUpdate({ _id: req.params.id, toUser: req.session.userId }, { status: 'rejected' });
        res.redirect('/users/requests');
    } catch (error) {
        res.status(500).send('Server Error');
    }
};

const showChatPage = async (req, res) => {
    try {
        const request = await Request.findById(req.params.id);
        if (request.fromUser.toString() !== req.session.userId && request.toUser.toString() !== req.session.userId) {
            return res.status(403).send('Not authorized');
        }

        // Fetch message history for this room and get the sender's name
        const messages = await Message.find({ room: request._id }).sort({ createdAt: 1 }).populate('sender', 'name');
        const user = await User.findById(req.session.userId); // Get current user's details

        res.render('chat', { title: 'Chat', requestId: request._id, messages: messages, user: user });
    } catch (error) {
        res.status(500).send('Server Error');
    }
};

const updateProfile = async (req, res) => {
    try {
        const { location, bio } = req.body;
        await User.findByIdAndUpdate(req.session.userId, { location, bio });
        res.redirect('/users/profile');
    } catch (error) {
        res.status(500).send('Server Error');
    }
};

const submitReview = async (req, res) => {
    const { rating, comment } = req.body;
    const { revieweeId, requestId } = req.params;
    const reviewerId = req.session.userId;

    try {
        // Create and save the new review
        const newReview = new Review({
            reviewee: revieweeId,
            reviewer: reviewerId,
            request: requestId,
            rating: Number(rating),
            comment,
        });
        await newReview.save();

        // --- Calculate and update the user's average rating ---
        const reviews = await Review.find({ reviewee: revieweeId });
        const totalRating = reviews.reduce((acc, item) => item.rating + acc, 0);
        const averageRating = totalRating / reviews.length;

        await User.findByIdAndUpdate(revieweeId, {
            averageRating: averageRating.toFixed(1), // Round to one decimal place
            reviewCount: reviews.length,
        });
        // --- End of calculation ---

        res.redirect('/users/requests');
    } catch (error) {
        console.error("Error submitting review:", error);
        res.status(500).send('Server Error');
    }
};

const showPublicProfile = async (req, res) => {
    try {
        // Find the user whose profile is being viewed
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send('User not found');
        }

        // Find all reviews for that user and populate the reviewer's name
        const reviews = await Review.find({ reviewee: user._id })
            .sort({ createdAt: -1 }) // Show newest reviews first
            .populate('reviewer', 'name'); // Get the name of the person who wrote the review

        res.render('public-profile', { title: `${user.name}'s Profile`, profileUser: user, reviews: reviews });
    } catch (error) {
        res.status(500).send('Server Error');
    }
};

const toggleWishlist = async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.userId);
        const userToBookmarkId = req.params.id;
        let isBookmarked;

        const index = currentUser.wishlist.indexOf(userToBookmarkId);

        if (index > -1) {
            currentUser.wishlist.splice(index, 1);
            isBookmarked = false; // The user was just unbookmarked
        } else {
            currentUser.wishlist.push(userToBookmarkId);
            isBookmarked = true; // The user was just bookmarked
        }

        await currentUser.save();
        
        // Send back a JSON response instead of redirecting
        res.json({ success: true, isBookmarked: isBookmarked });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

const showWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.session.userId).populate('wishlist');
        res.render('wishlist', { title: 'My Wishlist', wishlist: user.wishlist });
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
    showDashboard,
    sendRequest,
    showRequestsPage,
    acceptRequest,
    rejectRequest,
    showChatPage,
    updateProfile,
    submitReview,
    showPublicProfile,
    toggleWishlist,
    showWishlist,
};