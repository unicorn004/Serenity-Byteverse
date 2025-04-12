const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    scheduledTime: { type: Date, required: true },
    status: { type: String, enum: ['pending', 'sent'], default: 'pending' },
    emailStatus: { type: String, enum: ['pending', 'sent'], default: 'pending' },
}, { timestamps: true });

module.exports = mongoose.model('Notification', NotificationSchema);