const userModel = require('../model/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
require('dotenv').config();
const path = require('path');
const ejs = require('ejs');


const transport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS
    }
});
const generateOTP = () => {
    const numericValues = '0123456789';
    let code = '';
    for (i = 0; i < 6; i++) {
        code += numericValues[ Math.floor(Math.random() * 10) ];
    }
    return code;
};
const generateID = () => {
    const numericValues = '0123456789';
    let code = '';
    for (i = 0; i < 4; i++) {
        code += numericValues[ Math.floor(Math.random() * 10) ];
    }
    return code;
};
exports.signupUser = async (req, res) => {
    try {
        const { userName, phoneNo, password, email } = req.body;

        if (!userName || !password || !email) {
            res.status(403).json({
                message: 'User credentials required'
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(password, salt);
        const OTP = generateOTP();

        const createUser = await userModel({
            userName,
            email,
            phoneNo,
            password: hashed,
            otp: OTP,
            userID: generateID()
        });

        await createUser.save();

        const file = path.join(__dirname, "../views/index.ejs");

        const ejsXml = await ejs.renderFile(file, { name: createUser.userName, otp: OTP });
        const mailOption = {
            from: "Recykie",
            to: email,
            subject: "Account verification",
            html: ejsXml
        };

        transport.sendMail(mailOption, (err, info) => {
            if (err) {
                console.log(err);
            } else {
                console.log("mail sent", info.response);
            }
        });

        res.status(201).json({
            status: 'Successs',
            message: 'Check Your email to verify your account',
            data: createUser._id
        });
    } catch (error) {
        res.status(500).json({
            status: 'Fail',
            message: error.message
        });
        console.log(error);
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

        await userModel.findByIdAndUpdate(id, { otp: '', isVerified: true }, { new: true });
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

        const getUser = await userModel.findOne({ email });
        if (!getUser) return res.status(404).json({ message: 'user does not exist' });
        if (getUser.isVerified === false) return res.status(404).json({ message: 'user is not verified' });

        const comparePassword = await bcrypt.compare(password, getUser.password);
        if (!comparePassword) return res.status(400).json({ message: 'Wrong Password' });

        const logInUserToken = await jwt.sign({ id: getUser._id }, process.env.JWT_SECRET, { expiresIn: process.env.EXPIRING_DATE });

        const { userName, ...info } = getUser._doc;

        res.status(200).json({
            status: 'Success',
            data: { logInUserToken, userName }
        });
    } catch (error) {
        res.status(500).json({
            status: 'Fail',
            message: error.message
        });
        console.log(error);
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

        const userDetail = await userModel.findById(id).populate('pickup').sort({ createdAt: 'desc' });
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

        const userDetail = await userModel.findById(id).populate('pickup').sort({ createdAt: 'desc' });

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

        // const file = req.f;
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
        const adminId = req.user.id;
        const { rewardMoney } = req.body;

        const admin = await userModel.find({ _id: adminId });
        if (!admin.isAdmin) return res.status(403).json({ message: 'You can not perform this action' });
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