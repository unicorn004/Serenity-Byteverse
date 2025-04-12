const CounselorSession = require('../models/CounselorBooking');

const bookSession = async (req, res) => {
    try {
        const session = await CounselorSession.create({ user: req.user.id, counselorId: req.body.counselorId });
        res.status(201).json({ message: 'Session booked successfully', session });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getUserBookings = async (req, res) => {
    try {
        const sessions = await CounselorSession.find({ user: req.user.id });
        res.json(sessions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { bookSession, getUserBookings };