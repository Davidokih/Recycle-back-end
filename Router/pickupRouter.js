const express = require('express');
const { createPickupRequest, getPickuptDetail, getRequest, updatePickupRequest, deletePickupRequest } = require('../controller/pickUpController');
const auth = require('../utils/auth');

const router = express.Router();

router.route('/').get(getRequest);
router.route('/create').post(auth, createPickupRequest);
router.route('/:pickupId').get(getPickuptDetail);
router.route('/update/:pickupId').patch(updatePickupRequest);
router.route('/delete/:pickupId').delete(deletePickupRequest);

module.exports = router;