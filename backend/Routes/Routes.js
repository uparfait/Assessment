const Router = require('express').Router();
const multer = require('multer');
const crypto = require('crypto');
const path = require('path');
const INDEX_CONTROLLER = require('../Controllers/index.js');


const images_path = path.join(__dirname, '../upload/images');

// multer configurations
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, images_path);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + crypto.randomBytes(4).toString('hex');
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});

const upload = multer({ storage: storage });


// news routes
Router.post('/news/create', upload.single('image'), INDEX_CONTROLLER.create_news);
Router.get('/news/all', INDEX_CONTROLLER.get_all_news);
Router.get('/news/:id', INDEX_CONTROLLER.get_news_by_id);
Router.put('/news/update/:id', upload.single('image'), INDEX_CONTROLLER.update_news);
Router.delete('/news/delete/:id', INDEX_CONTROLLER.delete_news);

// categories routes
Router.post('/categories/create', INDEX_CONTROLLER.create_category);
Router.get('/categories/all', INDEX_CONTROLLER.get_all_categories);
Router.delete('/categories/delete/:id', INDEX_CONTROLLER.delete_category);


module.exports = Router;