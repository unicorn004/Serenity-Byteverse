const mongoose = require('mongoose');

const CommunityPostSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    anonymous: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('CommunityPost', CommunityPostSchema);