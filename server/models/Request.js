// server/models/Request.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const requestSchema = new Schema({
    fromUser: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    toUser: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending',
    },
}, {
    timestamps: true,
});

const Request = mongoose.model('Request', requestSchema);

module.exports = Request;