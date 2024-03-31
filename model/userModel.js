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
    address: {
        type: String
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
        type: String
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    otp: {
        type: String
    },
    isVerified: {
        type: Boolean
    },
    rewardMoney: {
        type: Number,
        default: 0
    },
    pickup: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'pickups'
        }
    ]
}, { timestamps: true });


module.exports = mongoose.model('users', userModel);