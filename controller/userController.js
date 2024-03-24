const userModel = require('../model/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();


const generateOTP = () => {
    const numericValues = '0123456789';
    let code = '';
    for (i = 0; i < 6; i++) {
        code += numericValues[ Math.floor(Math.random() * 10) ];
    }
    return code;
};
exports.signupUser = async (req, res) => {
    try {
        const { userName, password, email } = req.body;

        if (!userName || !password || !email) {
            res.status(403).json({
                message: 'User credentials required'
            });
        }

        const salt = await bcrypt.genSalt(process.env.SALT);
        const hashed = await bcrypt.hash(password, salt);

        const createUser = await userModel({
            userName,
            email,
            password: hashed,
            otp: generateOTP()
        });

        await createUser.save();
        res.status(201).json({
            status: 'Successs',
            message: 'Check Your email to verify your account'
        });
    } catch (error) {
        res.status(500).json({
            status: 'Fail',
            message: error.message
        });
    }
};

exports.verifyUser = async (req, res) => {
    try {
        const id = req.params.userId;
        const { otp } = req.body;

        const getUser = await userModel.findById(id);
        if (getUser.otp !== otp) {
            res.status(400).json({
                message: 'invalid otp'
            });
        }

        await userModel.findByIdAndUpdate(id, { otp: '' }, { new: true });
        res.status(200).json({
            status: 'Success',
            message: 'user is now verified, proceed to signin'
        });
    } catch (error) {
        res.status(500).json({
            status: 'Fail',
            message: error.message
        });
    }
};

exports.signinUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email && password) return res.status(403).json({ message: 'user email and password must be added' });

        const getUser = await userModel.find({ email });
        if (!getUser) return res.status(404).json({ message: 'users does not exist' });

        const comparePassword = await bcrypt.compare(password, getUser.password);
        if (!comparePassword) return res.status(400).json({ message: 'Wrong Password' });

        const logInUser = await jwt.sign({ id: getUser._id }, process.env.JWT_SECRET, { expiresIn: process.env.EXPIRING_DATE });

        const { userName, ...info } = getUser._doc;

        res.status(200).json({
            status: 'Success',
            data: { logInUser, ...info }
        });
    } catch (error) {
        res.status(500).json({
            status: 'Fail',
            message: error.message
        });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find().sort({ createdAt: 'desc' });

        if (users <= 0) return res.status(404).json({ message: 'No record found' });

        res.status(200).json({
            status: 'Success',
            data: users
        });
    } catch (error) {
        res.status(500).json({
            status: 'Fail',
            message: error.message
        });
    }
};

exports.logedInUserDetail = async (req, res) => {
    try {
        const id = req.user.id;

        const userDetail = await userModel.findById(id);
        if (!userDetail) return res.status(404).json({ message: 'user does not exist' });

        res.status(200).json({
            status: 'Success',
            data: userDetail
        });
    } catch (error) {
        res.status(500).json({
            status: 'Fail',
            message: error.message
        });
    }
};

exports.getAUserDetail = async (req, res) => {
    try {
        const id = req.params.userId;

        const userDetail = await userModel.findById(id);

        if (!userDetail) return res.status(404).json({ message: 'user does not exist' });

        res.status(200).json({
            status: 'Success',
            data: userDetail
        });

    } catch (error) {
        res.status(500).json({
            status: 'Fail',
            message: error.message
        });
    }
};

exports.updateUserDetail = async (req, res) => {
    try {
        const user = await userModel.find({ _id: req.user.id });

        if (!user) return res.status(404).json({ message: 'user does not exist' });

        const file = req.f;
        const update = await userModel.findByIdAndUpdate(user._id, req.body, { new: true });


    } catch (error) {
        res.status(500).json({
            status: 'Fail',
            message: error.message
        });
    }
};

exports.rewardUserMoney = async (req, res) => {
    try {
        const id = req.params.userId;
        const { rewardMoney } = req.body;

        const user = await userModel.findById(id);
        if (!user) return res.status(404).json({ message: 'user does not exist' });

        user.rewardMoney += rewardMoney;
        user.save;

        res.status(200).json({
            status: 'Success',
            message: `Reward of ${rewardMoney} was awrded to ${user.userName}`
        });
    } catch (error) {
        res.status(500).json({
            status: 'Fail',
            message: error.message
        });
    }
};