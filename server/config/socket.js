const socketIo = require('socket.io');

let connectedUsers = {};

module.exports = (server) => {
    const io = socketIo(server, {
        cors: {
            origin: "*", // Allow all origins 
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);

        socket.on('register', (userId) => {
            connectedUsers[userId] = socket.id;
            console.log('User registered:', userId);
        });

        socket.on('startCall', (data) => {
            const { callerId, receiverId } = data;
            const receiverSocketId = connectedUsers[receiverId];

            if (receiverSocketId) {
                io.to(receiverSocketId).emit('incomingCall', { callerId });
            } else {
                console.log('Receiver is not connected');
            }
        });

        socket.on('acceptCall', (data) => {
            const { callerId, receiverId } = data;
            const receiverSocketId = connectedUsers[receiverId];

            if (receiverSocketId) {
                io.to(receiverSocketId).emit('callAccepted', { callerId });
                io.to(callerId).emit('callAccepted', { receiverId });
            }
        });

        socket.on('endCall', (data) => {
            const { callerId, receiverId } = data;
            const receiverSocketId = connectedUsers[receiverId];

            if (receiverSocketId) {
                io.to(receiverSocketId).emit('callEnded');
            }
            io.to(callerId).emit('callEnded');
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
            for (const userId in connectedUsers) {
                if (connectedUsers[userId] === socket.id) {
                    delete connectedUsers[userId];
                    break;
                }
            }
        });
    });

    return io; 
};