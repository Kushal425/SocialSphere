const Message = require('../models/Message');
const User = require('../models/Users');

// Send a message
exports.sendMessage = async (req, res) => {
    try {
        const { recipientId, content } = req.body;
        const senderId = req.user.id;

        const recipient = await User.findById(recipientId);
        if (!recipient) {
            return res.status(404).json({ message: 'Recipient not found' });
        }

        const newMessage = new Message({
            sender: senderId,
            recipient: recipientId,
            content,
        });

        const savedMessage = await newMessage.save();
        res.status(201).json(savedMessage);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get conversation with a user
exports.getMessages = async (req, res) => {
    try {
        const { userId } = req.params;
        const currentUserId = req.user.id;

        const messages = await Message.find({
            $or: [
                { sender: currentUserId, recipient: userId },
                { sender: userId, recipient: currentUserId },
            ],
        })
            .sort({ createdAt: 1 }) // Oldest first for chat history
            .populate('sender', 'username email')
            .populate('recipient', 'username email');

        res.status(200).json(messages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
