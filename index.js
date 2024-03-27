const express = require('express');
const cors = require('cors');
require('./config/db');
require('dotenv').config();

const userRouter = require('./Router/userRouter');
const pickupRouter = require('./Router/pickupRouter');

const app = express();
const port = process.env.PORT || 1111;

app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.json({
        message: 'Default end-point'
    });
});

app.use('/api/users', userRouter);
app.use('/api/pickup', pickupRouter);

app.listen(port, () => {
    console.log('listening to port: ' + port);
});