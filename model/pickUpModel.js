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
        type: Strin
    }
}, { timestamps: true });

module.exports = mongoose.model('pickups', pickUpModel);