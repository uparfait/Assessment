const express = require('express');
const connect_database = require('./bd_connection');
const routes = require('./Routes/Routes.js');
const app = express();
const PORT = 2025;

app.use(express.json());


app.use('/uploads/images', express.static('upload/images'));


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
})

async function main() {
    await connect_database();

    app.use('/bc', routes);

    app.listen(PORT, () => {
        console.log(`Server Lounched on http://localhost:${PORT}`);
    });
}


main();