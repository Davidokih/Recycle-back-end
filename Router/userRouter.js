const express = require('express');
const { signupUser, signinUser, verifyUser, getAllUsers, getAUserDetail, logedInUserDetail, rewardUserMoney } = require('../controller/userController');
const auth = require('../utils/auth');

const router = express.Router();

router.route('/').get(getAllUsers);
router.route('/signup').post(signupUser);
router.route('/signin').post(signinUser);
router.route('/verify/:userId').patch(verifyUser);
router.route('/profile').get(auth, logedInUserDetail);
router.route('/:userId').get(getAUserDetail);
router.route('/reward/:userId').patch(auth, rewardUserMoney);

module.exports = router;
