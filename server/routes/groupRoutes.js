// routes/groupRoutes.js
const express = require('express');
const router = express.Router();
const {
  fetchGroups,
  createGroup,
  joinGroup,
  fetchMessages,
  sendMessage,
} = require('../controllers/groupController');

// Fetch all groups
router.get('/', fetchGroups);

// Create a new group
router.post('/', createGroup);

// Join a group
router.post('/:groupId/join', joinGroup);

// Fetch messages for a group
router.get('/:groupId/messages', fetchMessages);

// Send a message to a group
router.post('/:groupId/messages', sendMessage);

module.exports = router;