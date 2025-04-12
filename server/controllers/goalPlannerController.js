const Goal = require('../models/GoalPlanner');

const createGoal = async (req, res) => {
    try {
        const goal = await Goal.create({ user: req.user.id, title: req.body.title, progress: 0 });
        res.status(201).json(goal);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getGoals = async (req, res) => {
    try {
        const goals = await Goal.find({ user: req.user.id });
        res.json(goals);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateGoalStatus = async (req, res) => {
    try {
        await Goal.findByIdAndUpdate(req.params.id, { progress: req.body.progress });
        res.json({ message: 'Goal updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { createGoal, getGoals, updateGoalStatus };