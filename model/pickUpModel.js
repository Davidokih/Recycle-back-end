const mongoose = require('mongoose');

const pickUpModel = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    pickupType: {
        type: String
    },
    pickupDate: {
        type: String
    },
    pickupTime: {
        type: String
    },
    status: {
        type: String,
        default: "pending"
    },
    notifyAdmin: {
        type: Boolean,
        default: true
    },
    notifyUser: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model('pickups', pickUpModel);