const express = require('express');
// const cors = require('cors');
require('./config/db');
require('dotenv').config();

const userRouter = require('./Router/userRouter');

const app = express();
const port = process.env.PORT || 1111;

// app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.json({
        message: 'Default end-point'
    });
});

app.use('/api/user', userRouter);

app.listen(port, () => {
    console.log('listening to port: ' + port);
});