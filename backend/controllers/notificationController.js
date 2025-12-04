const Notification = require('../models/Notification');

// Get notifications for the current user
exports.getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ recipient: req.user.id })
            .sort({ createdAt: -1 })
            .populate('sender', 'username email')
            .populate('post', 'title');

        res.status(200).json(notifications);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Mark notification as read
exports.markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        // Ensure the user owns the notification
        if (notification.recipient.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        notification.read = true;
        await notification.save();

        res.status(200).json(notification);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
