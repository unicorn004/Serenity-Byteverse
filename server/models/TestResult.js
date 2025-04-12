const mongoose = require('mongoose');

const TestResultSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    testType: { type: String, required: true },
    score: { type: Number, required: true },
    result: { type: String, required: true },
    date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('TestResult', TestResultSchema);