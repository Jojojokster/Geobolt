const express = require('express');
const authController = require('../controllers/auth.js');

const router = express.Router();

// Handle user registration
router.post('/register', authController.register);

// Handle user login
router.post('/login', authController.login);

module.exports = router;