const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/signin', authController.signIn);
router.post('/register', authController.register);

module.exports = router;