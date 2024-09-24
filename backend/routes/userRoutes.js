const express = require('express');
const { getUser, updateUser} = require('../controllers/userController');
const authenticateToken = require('../middlewares/authenticateToken');
// const {uploadAds} = require('../middlewares/multerConfig');

const router = express.Router();

router.put('/', authenticateToken, updateUser);
router.get('/', authenticateToken, getUser);

module.exports = router;