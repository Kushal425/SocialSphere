const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, searchUsers, sendFriendRequest, acceptFriendRequest, rejectFriendRequest, removeFriend, getFriends, uploadProfilePhoto, uploadBannerPhoto } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// Specific routes MUST come before the generic /:id route
router.route('/search').get(protect, searchUsers);
router.route('/profile').put(protect, updateProfile);
router.route('/profile/photo').post(protect, uploadProfilePhoto);
router.route('/profile/banner').post(protect, uploadBannerPhoto);
router.route('/friends').get(protect, getFriends);
router.route('/request/:id').post(protect, sendFriendRequest);
router.route('/accept/:id').post(protect, acceptFriendRequest);
router.route('/reject/:id').post(protect, rejectFriendRequest);
router.route('/remove/:id').post(protect, removeFriend);

// Generic route MUST be last
router.route('/:id').get(getProfile);

module.exports = router;
