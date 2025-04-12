const express = require('express');
const { createGoal, getGoals, updateGoalStatus } = require('../controllers/goalPlannerController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/set', protect, createGoal);
router.get('/list', protect, getGoals);
router.put('/update/:id', protect, updateGoalStatus);

module.exports = router;