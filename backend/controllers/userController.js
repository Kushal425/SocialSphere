const User = require('../models/Users');
const Notification = require('../models/Notification');

// Get user profile
exports.getProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id)
            .select('-password')
            .populate('friends', 'username profilePhoto');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update user profile
exports.updateProfile = async (req, res) => {
    try {
        console.log('Update profile request body:', req.body);

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update fields (allow updating username, email, and potentially bio/avatar if added to schema later)
        // For now, based on existing schema, we update what's available or add new fields if schema allows strict: false (default is true)
        // Let's assume we might want to add bio/avatar to User schema later, but for now we stick to basic updates.
        // However, the requirement is "Profile Management", so let's allow updating username/email.

        if (req.body.username) user.username = req.body.username;
        if (req.body.email) user.email = req.body.email;
        if (req.body.bio !== undefined) user.bio = req.body.bio;

        // If password update is needed, it should be handled separately with hashing, skipping for now unless requested.

        const updatedUser = await user.save();
        console.log('Updated user:', { id: updatedUser._id, username: updatedUser.username, bio: updatedUser.bio });

        res.status(200).json({
            id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            bio: updatedUser.bio,
        });
    } catch (err) {
        console.error('Update profile error:', err);
        res.status(500).json({ error: err.message });
    }
};

// Search users
exports.searchUsers = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) return res.status(400).json({ message: 'Query is required' });

        const users = await User.find({
            username: { $regex: q, $options: 'i' },
            _id: { $ne: req.user.id }
        }).select('username email _id');

        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Send friend request
exports.sendFriendRequest = async (req, res) => {
    try {
        const receiverId = req.params.id;
        const senderId = req.user.id;

        if (receiverId === senderId) {
            return res.status(400).json({ message: 'Cannot send friend request to yourself' });
        }

        const sender = await User.findById(senderId);
        const receiver = await User.findById(receiverId);

        if (!receiver) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if already friends
        if (sender.friends.includes(receiverId)) {
            return res.status(400).json({ message: 'Already friends' });
        }

        // Check if request already sent
        if (receiver.friendRequests.includes(senderId)) {
            return res.status(400).json({ message: 'Friend request already sent' });
        }

        receiver.friendRequests.push(senderId);
        await receiver.save();

        // Create notification for the receiver
        await Notification.create({
            recipient: receiverId,
            sender: senderId,
            type: 'friend_request',
            message: `${sender.username} sent you a friend request`
        });

        res.status(200).json({ message: 'Friend request sent' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Accept friend request
exports.acceptFriendRequest = async (req, res) => {
    try {
        const senderId = req.params.id;
        const receiverId = req.user.id;

        const sender = await User.findById(senderId);
        const receiver = await User.findById(receiverId);

        if (!sender || !receiver) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if friend request exists
        if (!receiver.friendRequests.includes(senderId)) {
            return res.status(400).json({ message: 'No friend request from this user' });
        }

        // Add to friends list and remove from requests
        receiver.friends.push(senderId);
        sender.friends.push(receiverId);
        receiver.friendRequests = receiver.friendRequests.filter(id => id.toString() !== senderId);

        await receiver.save();
        await sender.save();

        // Create notification for the sender that their request was accepted
        await Notification.create({
            recipient: senderId,
            sender: receiverId,
            type: 'friend_accept',
            message: `${receiver.username} accepted your friend request. You are now friends!`
        });

        // Create notification for the receiver (the one accepting) confirming the friendship
        await Notification.create({
            recipient: receiverId,
            sender: senderId,
            type: 'friend_accept',
            message: `You are now friends with ${sender.username}`
        });

        // Delete the original friend_request notification
        await Notification.deleteMany({
            recipient: receiverId,
            sender: senderId,
            type: 'friend_request'
        });

        res.status(200).json({ message: 'Friend request accepted' });
    } catch (err) {
        console.error('Accept friend request error:', err);
        res.status(500).json({ error: err.message });
    }
};

// Reject friend request
exports.rejectFriendRequest = async (req, res) => {
    try {
        const senderId = req.params.id;
        const receiverId = req.user.id;

        const receiver = await User.findById(receiverId);

        if (!receiver) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if friend request exists
        if (!receiver.friendRequests.includes(senderId)) {
            return res.status(400).json({ message: 'No friend request from this user' });
        }

        // Remove from requests
        receiver.friendRequests = receiver.friendRequests.filter(id => id.toString() !== senderId);
        await receiver.save();

        // Optionally create a notification for the sender (usually silent rejection is preferred, but can add if needed)
        // For now, we'll just remove the request.

        res.status(200).json({ message: 'Friend request rejected' });
    } catch (err) {
        console.error('Reject friend request error:', err);
        res.status(500).json({ error: err.message });
    }
};

// Remove friend
exports.removeFriend = async (req, res) => {
    try {
        const friendId = req.params.id;
        const userId = req.user.id;

        if (friendId === userId) {
            return res.status(400).json({ message: 'Cannot remove yourself' });
        }

        const user = await User.findById(userId);
        const friend = await User.findById(friendId);

        if (!user || !friend) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if they are friends
        if (!user.friends.includes(friendId)) {
            return res.status(400).json({ message: 'Not friends with this user' });
        }

        // Remove from both friends lists
        user.friends = user.friends.filter(id => id.toString() !== friendId);
        friend.friends = friend.friends.filter(id => id.toString() !== userId);

        await user.save();
        await friend.save();

        res.status(200).json({ message: 'Friend removed successfully' });
    } catch (err) {
        console.error('Remove friend error:', err);
        res.status(500).json({ error: err.message });
    }
};

// Get Friends
exports.getFriends = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('friends', 'username email');
        res.status(200).json(user.friends);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Upload Profile Photo (Base64)
exports.uploadProfilePhoto = async (req, res) => {
    try {
        const { photoData } = req.body;

        if (!photoData) {
            return res.status(400).json({ message: 'No photo data provided' });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.profilePhoto = photoData;
        await user.save();

        res.status(200).json({
            message: 'Profile photo uploaded successfully',
            profilePhoto: user.profilePhoto
        });
    } catch (err) {
        console.error('Upload error:', err);
        res.status(500).json({ error: err.message });
    }
};

// Upload Banner Photo (Base64)
exports.uploadBannerPhoto = async (req, res) => {
    try {
        const { bannerData } = req.body;

        if (!bannerData) {
            return res.status(400).json({ message: 'No banner data provided' });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.bannerPhoto = bannerData;
        await user.save();

        res.status(200).json({
            message: 'Banner photo uploaded successfully',
            bannerPhoto: user.bannerPhoto
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
