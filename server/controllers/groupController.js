// controllers/groupController.js
const Group = require('../models/Group');
const Message = require('../models/Message');

// Fetch all groups
const fetchGroups = async (req, res) => {
  try {
    const groups = await Group.find();
    res.status(200).json(groups);
  } catch (error) {
    console.error('Failed to fetch groups:', error);
    res.status(500).json({ message: 'Failed to fetch groups' });
  }
};

// Create a new group
const createGroup = async (req, res) => {
  const { name, description, category, privacy } = req.body;

  try {
    const newGroup = new Group({ name, description, category, privacy });
    await newGroup.save();
    res.status(201).json(newGroup);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'Group name must be unique' });
    } else {
      console.error('Failed to create group:', error);
      res.status(500).json({ message: 'Failed to create group' });
    }
  }
};

// Join a group
const joinGroup = async (req, res) => {
    const { groupId } = req.params;
    const userId = req.body.username;
  
    try {
      // 1. Find the group first
      const group = await Group.findById(groupId);
      if (!group) {
        return res.status(404).json({ message: 'Group not found' });
      }
  
      // 2. Check and add member
      if (!group.members.includes(userId)) {
        group.members.push(userId);
        await group.save();
      }
  
      res.status(200).json({ message: 'Joined group successfully' });
    } catch (error) {
      console.error('Failed to join group:', error);
      res.status(500).json({ message: 'Failed to join group' });
    }
  };

// Fetch messages for a group
const fetchMessages = async (req, res) => {
  const { groupId } = req.params;

  try {
    const messages = await Message.find({ groupId }).sort({ sentAt: 1 });
    res.status(200).json(messages);
  } catch (error) {
    console.error('Failed to fetch messages:', error);
    res.status(500).json({ message: 'Failed to fetch messages' });
  }
};

// Send a message to a group
const sendMessage = async (req, res) => {
    const { groupId } = req.params;
    const { message, sender } = req.body;
    
    if (!sender) {
        return res.status(400).json({ message: "Sender ID is required" });
      }
    
    try {
      const newMessage = new Message({ 
        groupId, 
        sender,
        message 
      });
      await newMessage.save();
      
      const io = req.app.get('io');
      if (!io) throw new Error('Socket.IO not initialized');
      
      io.to(groupId).emit('new_message', newMessage);
      res.status(201).json(newMessage);

    } catch (error) {
      console.error('Failed to send message:', error);
      res.status(500).json({ 
        message: 'Failed to send message',
        error: error.message 
    });
    }
};

module.exports = {
  fetchGroups,
  createGroup,
  joinGroup,
  fetchMessages,
  sendMessage,
};