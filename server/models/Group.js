// models/Group.js
const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, default: ""},
  category: { type: String },
  privacy: { type: String, enum: ['public', 'private'], default: 'public' },
  members: [{ type: String }], // Store usernames or user IDs
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Group', groupSchema);