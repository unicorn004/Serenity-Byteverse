const express = require('express');
const { createPost, getPosts, deletePost } = require('../controllers/communityController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/create', protect, createPost);
router.get('/all', getPosts);
router.delete('/:id', protect, deletePost);

module.exports = router;