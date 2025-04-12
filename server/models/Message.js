const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
  sender: { type: String, required: true }, // Username or "anonymous"
  message: { type: String, required: true },
  sentAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Message', messageSchema);