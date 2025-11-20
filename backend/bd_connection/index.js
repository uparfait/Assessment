const mongoose = require('mongoose');

const db_url = 'mongodb://localhost:27017/news_mgnt';


module.exports = async function connect_database() {
    try {

        await mongoose.mongoose.connect(db_url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to the database successfully');

    } catch(e) {
        throw e;
    }
}