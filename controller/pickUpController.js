const userModel = require('../model/userModel');
const pickUpModel = require('../model/pickUpModel');
const mongoose = require('mongoose');

exports.createPickupRequest = async (req, res) => {
    try {
        const id = req.user.id;
        const user = await userModel.findById(id);

        const { pickupType, pickupDate, address } = req.body;
        if (!user) return res.status(404).json({ message: 'user does not exist' });

        const create = new pickUpModel({
            pickupType,
            pickupDate,
            address,
            pickupTime: '9:00pm'
        });

        create.user = user;
        create.save();

        user.pickup.push(new mongoose.Types.ObjectId(create._id));
        user.save();

        res.status(201).json({
            status: 'Success',
            data: create
        });
    } catch (error) {
        res.status(500).json({
            status: 'Fail',
            message: error.message
        });
    }
};

exports.getRequest = async (req, res) => {
    try {
        const getAll = await pickUpModel.find().sort({ createdAt: 'desc' });

        res.status(200).json({
            status: 'Success',
            data: getAll
        });
    } catch (error) {
        res.status(500).json({
            status: 'Fail',
            message: error.message
        });
    }
};

exports.getPickuptDetail = async (req, res) => {
    try {
        const id = req.params.pickupId;

        const pickup = await pickUpModel.findById(id)populate('user');

        if (!pickup) return res.status(404).json({ message: 'Pickup Request Does not exist' });

        res.status(200).json({
            status: 'Success',
            data: pickup
        });

    } catch (error) {
        res.status(500).json({
            status: 'Fail',
            message: error.message
        });
    }
};

exports.updatePickupRequest = async (req, res) => {
    try {
        const id = req.params.pickupId;

        const pickup = await pickUpModel.findById(id);

        if (!pickup) return res.status(404).json({ message: 'Pickup Request Does not exist' });

        const update = await pickUpModel.findByIdAndUpdate(pickup._id, req.body, { new: true });

        res.status(200).json({
            status: 'Success',
            message: 'pickup updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            status: 'Fail',
            message: error.message
        });
    }
};

exports.deletePickupRequest = async (req, res) => {
    try {
        const pickup = await pickUpModel.findById(req.params.pickupId);
        if (!pickup) return res.status(404).json({ message: 'Pickup Request Does not exist' });
        const user = await userModel.findById(pickup.user);

        await pickUpModel.findByIdAndDelete(pickup._id);
        user.pickup.pull(pickup._id);
        user.save();

        res.status(200).json({
            status: 'Sucess',
            message: 'Pickup Request Deleted Successfully'
        });

    } catch (error) {
        res.status(500).json({
            status: 'Fail',
            message: error.message
        });
    }
};