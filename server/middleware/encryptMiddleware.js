const crypto = require('crypto');
const secretKey = process.env.ENCRYPT_SECRET || 'default_secret';

const encryptUsername = (req, res, next) => {
    if (req.body.username) {
        const cipher = crypto.createCipher('aes-256-cbc', secretKey);
        let encrypted = cipher.update(req.body.username, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        req.body.username = encrypted;
    }
    next();
};

module.exports = { encryptUsername };