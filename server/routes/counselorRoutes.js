const express = require('express');
const { bookSession, getUserBookings } = require('../controllers/counselorController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/book', protect, bookSession);
router.get('/my-sessions', protect, getUserBookings);

module.exports = router;