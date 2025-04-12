const mongoose = require('mongoose');

const CounselorBookingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    counselorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    sessionTime: { type: Date, required: true },
    status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('CounselorBooking', CounselorBookingSchema);