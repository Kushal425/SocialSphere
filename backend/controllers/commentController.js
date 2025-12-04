const Comment = require('../models/Comment');
const Post = require('../models/Post');
const Notification = require('../models/Notification');

// Add a comment
exports.addComment = async (req, res) => {
    try {
        const { content } = req.body;
        const postId = req.params.postId;

        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        const newComment = new Comment({
            content,
            post: postId,
            author: req.user.id,
        });

        const savedComment = await newComment.save();

        // Create notification if not commenting on own post
        const postDoc = await Post.findById(postId);
        if (postDoc && postDoc.author.toString() !== req.user.id) {
            await Notification.create({
                recipient: postDoc.author,
                sender: req.user.id,
                type: 'comment',
                post: postDoc._id
            });
        }

        res.status(201).json(savedComment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get comments for a post
exports.getCommentsByPost = async (req, res) => {
    try {
        const comments = await Comment.find({ post: req.params.postId })
            .populate('author', 'username email')
            .sort({ createdAt: -1 });
        res.status(200).json(comments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update a comment
exports.updateComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) return res.status(404).json({ message: 'Comment not found' });

        if (comment.author.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        comment.content = req.body.content || comment.content;
        const updatedComment = await comment.save();
        res.status(200).json(updatedComment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete a comment
exports.deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) return res.status(404).json({ message: 'Comment not found' });

        if (comment.author.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await Comment.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Comment deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
