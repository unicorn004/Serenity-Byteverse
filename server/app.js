const express = require('express');
const http = require('http');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');

dotenv.config();
const { bookSession, getUserBookings } = require('./controllers/counselorController');
const { protect } = require('./middleware/authMiddleware');
const sessionRouter = require('./routes/counselorRoutes');

const app = express();
const server = http.createServer(app);

require('./config/socket')(server);
app.use(express.json());
app.use(cors());

connectDB();

const userRoutes = require('./routes/userRoutes');
const assessmentRoutes = require('./routes/assessmentRoutes');
const chatbotRoutes = require('./routes/chatbotRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const communityRoutes = require('./routes/communityRoutes');
const counselorRoutes = require('./routes/counselorRoutes');
const diaryRoutes = require('./routes/diaryRoutes');
const testRoutes = require('./routes/testRoutes');
const goalPlannerRoutes = require('./routes/goalPlannerRoutes');

app.use('/api/users', userRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/counselors', counselorRoutes);
app.use('/api/diary', diaryRoutes);
app.use('/api/ml-tests', testRoutes);
app.use('/api/goals', goalPlannerRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});