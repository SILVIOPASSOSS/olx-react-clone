const express = require('express');
const { uploadCategory } = require('../middlewares/multerConfig');
const { createCategory, getCategories } = require('../controllers/categoriesController');

const router = express.Router();

router.post('/', uploadCategory.single('img'), createCategory);
router.get('/', getCategories);

module.exports = router;