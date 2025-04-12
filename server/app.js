const express = require('express');
const http = require('http');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const { Server } = require('socket.io');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.set('io', io);
// Integrate Socket.IO
require('./config/socket')(server);

// Middleware
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:5173','http://localhost:3000'],
  credentials: true,
})
);

// Connect to the database
connectDB();

// Routes
const userRoutes = require('./routes/userRoutes');
const assessmentRoutes = require('./routes/assessmentRoutes');
const chatbotRoutes = require('./routes/chatbotRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const communityRoutes = require('./routes/communityRoutes');
const counselorRoutes = require('./routes/counselorRoutes');
const diaryRoutes = require('./routes/diaryRoutes');
const testRoutes = require('./routes/testRoutes');
const goalPlannerRoutes = require('./routes/goalPlannerRoutes');
const groupRoutes = require('./routes/groupRoutes');

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/counselors', counselorRoutes);
app.use('/api/diary', diaryRoutes);
app.use('/api/ml-tests', testRoutes);
app.use('/api/goals', goalPlannerRoutes);
app.use('/api/groups', groupRoutes); // Add group routes

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});