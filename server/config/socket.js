const { Server } = require('socket.io');
const Message = require('../models/Message');

module.exports = (server) => {
  const io = new Server(server, {
    cors: {
      origin: ['http://localhost:5173','http://localhost:3000'],
      methods: ['GET', 'POST'],
    },
    transports: ['websocket', 'polling']
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

    socket.on('send_message', async (data) => {
      const { groupId, sender, message } = data;

      try {
        io.to(groupId).emit('new_message', message);
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