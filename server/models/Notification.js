const mongoose = require('mongoose');
const { Schema } = mongoose;

const notificationSchema = new Schema({
    recipient: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    type: {
        type: String,
        enum: ['new_request', 'request_accepted', 'request_rejected'],
        required: true,
    },
    isRead: {
        type: Boolean,
        default: false,
    },
    // A link to the relevant page, like the requests page
    link: {
        type: String,
        default: '/users/requests'
    }
}, {
    timestamps: true,
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;