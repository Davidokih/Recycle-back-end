const mongoose = require('mongoose');

const userModel = mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phoneNo: {
        type: String
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String
    },
    userID: {
        type: Number
    },
    isAdmin: {
        type: Boolean
    },
    otp: {
        type: String
    },
    isVerified: {
        type: Number
    },
    points: [
        {}
    ],
    pickups: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'pickups'
        }
    ]
}, { timestamps: true });


module.exports = mongoose.model('users', userModel);