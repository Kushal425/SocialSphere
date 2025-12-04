const Post = require('../models/Post');
const Notification = require('../models/Notification');

// Create a new post
exports.createPost = async (req, res) => {
    try {
        const { title, content, tags, category } = req.body;
        const newPost = new Post({
            title,
            content,
            tags,
            category,
            author: req.user.id,
        });
        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get all posts with search, filter, sort, and pagination
exports.getAllPosts = async (req, res) => {
    try {
        const { page = 1, limit = 10, search, tag, category, sort, author } = req.query;
        const query = {};

        // Filter by author if provided (for profile pages)
        if (author) {
            query.author = author;
        }

        // Search by title or content
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { content: { $regex: search, $options: 'i' } }
            ];
        }

        // Filter by tag
        if (tag) {
            query.tags = tag;
        }

        // Filter by category
        if (category) {
            query.category = category;
        }

        const sortOptions = {};
        if (sort === 'oldest') sortOptions.createdAt = 1;
        else if (sort === 'popular') sortOptions.likes = -1;
        else sortOptions.createdAt = -1; // Default newest

        const posts = await Post.find(query)
            .populate('author', 'username email')
            .sort(sortOptions)
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await Post.countDocuments(query);

        res.status(200).json({
            posts,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get a single post by ID
exports.getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('author', 'username email');
        if (!post) return res.status(404).json({ message: 'Post not found' });
        res.status(200).json(post);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update a post
exports.updatePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        // Check if user is the author
        if (post.author.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const updatedPost = await Post.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.status(200).json(updatedPost);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete a post
exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        // Check if user is the author
        if (post.author.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await Post.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Post deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Like/Unlike a post
exports.likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        if (post.likes.includes(req.user.id)) {
            // Unlike
            post.likes = post.likes.filter((id) => id.toString() !== req.user.id);
        } else {
            // Like
            post.likes.push(req.user.id);
        }

        await post.save();

        // Create notification if it's a like (not unlike) and not liking own post
        if (post.likes.includes(req.user.id) && post.author.toString() !== req.user.id) {
            const User = require('../models/Users');
            const liker = await User.findById(req.user.id);
            await Notification.create({
                recipient: post.author,
                sender: req.user.id,
                type: 'like',
                post: post._id,
                message: `${liker.username} liked your post "${post.title}"`
            });
        }

        res.status(200).json(post);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
