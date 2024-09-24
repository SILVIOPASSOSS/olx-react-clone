const multer = require('multer');
const path = require('path');

const categoryStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Diretório para armazenar arquivos
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Nome único para o arquivo
  },
});

const adsStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'media/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const uploadCategory = multer({ storage: categoryStorage });
const uploadAds = multer({ storage: adsStorage});


module.exports = {
  uploadCategory,
  uploadAds,
};