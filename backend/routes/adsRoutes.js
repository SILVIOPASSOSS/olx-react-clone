const express = require('express');
const {uploadAds} = require('../middlewares/multerConfig');
const { createAd, getAds, getAdById, incrementAdViews, getAdsByUser, updateAd, deleteAd} = require('../controllers/adsController');
const authenticateToken = require('../middlewares/authenticateToken');

const router = express.Router();

router.post('/',authenticateToken, uploadAds.array('images', 10), createAd);
router.get('/', getAds);
//router.get('/search', getFilteredAds);
router.get('/item/:id', incrementAdViews);
router.get('/:id', getAdById);
router.get('/user/:userId', authenticateToken, getAdsByUser);
router.put('/:id', authenticateToken, uploadAds.array('images', 10), updateAd);
router.delete('/:id', authenticateToken, deleteAd)

module.exports = router;
