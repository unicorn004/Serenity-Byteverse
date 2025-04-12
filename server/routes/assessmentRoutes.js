const express = require('express');
const { submitAssessment, getUserAssessments } = require('../controllers/assessmentController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/submit', protect, submitAssessment);
router.get('/history', protect, getUserAssessments);

module.exports = router;