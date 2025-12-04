const express = require('express');
const router = express.Router();
const {
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost,
    likePost,
} = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(getAllPosts).post(protect, createPost);
router
    .route('/:id')
    .get(getPostById)
    .put(protect, updatePost)
    .delete(protect, deletePost);
router.route('/:id/like').post(protect, likePost);

module.exports = router;
