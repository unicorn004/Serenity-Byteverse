const Notification = require('../models/Notification');
const User = require('../models/User'); 
const { sendEmail } = require('../utils/email');

const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ userId: req.user.id });  
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id).populate('userId');  

        if (notification) {
            notification.status = 'sent'; 
            notification.emailStatus = 'sent'; 

            if (notification.emailStatus === 'pending') {
                const userEmail = notification.userId.email; 
                await sendEmail(
                    userEmail, 
                    'New Notification',
                    notification.message
                );
                notification.emailStatus = 'sent'; 
            }

            await notification.save();
            res.json({ message: 'Notification marked as read and email sent' });
        } else {
            res.status(404).json({ message: 'Notification not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createNotification = async (userId, message, scheduledTime) => {
    try {
        const user = await User.findById(userId); 

        const newNotification = await Notification.create({
            userId, 
            message,
            scheduledTime,
        });

        if (user && user.email) {
            await sendEmail(user.email, 'New Notification', message);
        }

        return newNotification;
    } catch (error) {
        throw new Error('Error creating notification or sending email: ' + error.message);
    }
};

module.exports = { getNotifications, markAsRead, createNotification };