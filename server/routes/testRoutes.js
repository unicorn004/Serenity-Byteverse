const express = require('express');
const { submitMLTest, getMLTestResults } = require('../controllers/testController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/submit', protect, submitMLTest);
router.get('/history', protect, getMLTestResults);

module.exports = router;