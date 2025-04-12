const Assessment = require('../models/Assessment');

const submitAssessment = async (req, res) => {
    try {
        const assessment = await Assessment.create({ user: req.user.id, responses: req.body.responses });
        res.status(201).json({ message: 'Assessment saved successfully', assessment });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getUserAssessments = async (req, res) => {
    try {
        const assessments = await Assessment.find({ user: req.user.id });
        res.json(assessments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { submitAssessment, getUserAssessments };