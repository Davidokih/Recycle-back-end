const mongoose = require('mongoose');
require('dotenv').config();

const DATABASE_URL = process.env.LIVE_URL;

mongoose.connect(DATABASE_URL).then(() => {
    console.log('Database connected to server');
}).catch((error) => {
    console.log('An error occured while connecting the database' + error);
});