const express = require('express');
const authController = require('../controllers/auth.js');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login); // Ensure the /login route is defined

module.exports = router;