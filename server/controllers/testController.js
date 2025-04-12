const axios = require('axios');
const TestResult = require('../models/TestResult');

const submitMLTest = async (req, res) => {
    try {
        const { testType, answers } = req.body;
        if (!testType || !answers || !Array.isArray(answers)) {
            return res.status(400).json({ message: 'Invalid test data' });
        }

        // Send test data to the ML model (Django endpoint)
        const djangoMLServer = process.env.ML_SERVER_URL || 'http://127.0.0.1:8000/predict';
        const response = await axios.post(djangoMLServer, { answers });

        const { prediction, confidence } = response.data;

        const newTestResult = await TestResult.create({
            userId: req.user.id,
            testType,
            score: confidence,
            result: prediction
        });

        res.status(201).json({ message: 'Test submitted successfully', result: newTestResult });
    } catch (error) {
        console.error('ML Test Error:', error);
        res.status(500).json({ message: 'Error processing test', error: error.message });
    }
};

const getMLTestResults = async (req, res) => {
    try {
        const results = await TestResult.find({ userId: req.user.id }).sort({ date: -1 });
        res.json(results);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving test results', error: error.message });
    }
};

module.exports = { submitMLTest, getMLTestResults };