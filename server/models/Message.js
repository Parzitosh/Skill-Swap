const mongoose = require('mongoose');
const { Schema } = mongoose;

const messageSchema = new Schema({
    room: { // This will be the ID of the Request
        type: Schema.Types.ObjectId,
        ref: 'Request',
        required: true,
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;