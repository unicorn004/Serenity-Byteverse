const mongoose = require('mongoose');

const GoalPlannerSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    goal: { type: String, required: true },
    deadline: { type: Date, required: true },
    status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' },
    backupPlan: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('GoalPlanner', GoalPlannerSchema);