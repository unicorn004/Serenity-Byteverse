const { Server } = require('socket.io');
const Message = require('../models/Message');

module.exports = (server) => {
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:5173',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Join a group
    socket.on('join_group', (groupId) => {
      socket.join(groupId);
      console.log(`User ${socket.id} joined group ${groupId}`);
    });

    // Leave a group
    socket.on('leave_group', (groupId) => {
      socket.leave(groupId);
      console.log(`User ${socket.id} left group ${groupId}`);
    });

    // Send a message
    socket.on('send_message', async (data) => {
      const { groupId, sender, message } = data;

      try {
        // Save the message to MongoDB
        const newMessage = new Message({ groupId, sender, message });
        await newMessage.save();

        // Broadcast the message to all users in the group
        io.to(groupId).emit('new_message', newMessage);
      } catch (error) {
        console.error('Failed to send message:', error);
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};