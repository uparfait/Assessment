const mongoose = require('mongoose');

const NewsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    date: {
        type: String,
        default: `${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()} :: ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`,
    },
    category: {
        type: String,
        required: true
    },
    image_url: {
        type: String,
        required: true
    }
});

const NewsModel = mongoose.model('News', NewsSchema);

module.exports = NewsModel;