const express = require('express');
const { chatWithBot } = require('../controllers/chatbotController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/ask', protect, chatWithBot);

module.exports = router;