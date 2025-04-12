const CommunityPost = require('../models/CommunityPost');

const createPost = async (req, res) => {
    try {
        const post = await CommunityPost.create({ user: req.user.id, content: req.body.content });
        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getPosts = async (req, res) => {
    try {
        const posts = await CommunityPost.find().populate('user', 'username');
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deletePost = async (req, res) => {
    try {
        await CommunityPost.findByIdAndDelete(req.params.id);
        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { createPost, getPosts, deletePost };