const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true, // Each email must be unique
    },
    password: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        default: '',
    },
    bio: {
        type: String,
        default: '',
    },
    skillsOffered: {
        type: [String], // An array of strings
        default: [],    // Defaults to an empty array
    },
    skillsNeeded: {
        type: [String],
        default: [],
    },
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
});

const User = mongoose.model('User', userSchema);

module.exports = User;