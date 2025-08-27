const mongoose = require('mongoose');
const { Schema } = mongoose;

const reviewSchema = new Schema({
    // The user who is being reviewed
    reviewee: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    // The user who is writing the review
    reviewer: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    // The request this review is associated with
    request: {
        type: Schema.Types.ObjectId,
        ref: 'Request',
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    comment: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;