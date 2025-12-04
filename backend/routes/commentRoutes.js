const express = require('express');
const router = express.Router();
const {
    addComment,
    getCommentsByPost,
    updateComment,
    deleteComment,
} = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');

router.route('/:postId').get(getCommentsByPost).post(protect, addComment);
router
    .route('/comment/:id')
    .put(protect, updateComment)
    .delete(protect, deleteComment);

module.exports = router;
