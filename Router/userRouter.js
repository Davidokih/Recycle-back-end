const express = require('express');
const { signupUser, signinUser, verifyUser, getAllUsers, getAUserDetail, logedInUserDetail } = require('../controller/userController');

const router = express.Router();

router.route('/').get(getAllUsers);
router.route('/signup').post(signupUser);
router.route('/signin').post(signinUser);
router.route('/verify/:userId').patch(verifyUser);
router.route('/profile').get(logedInUserDetail);
router.route('/:userId').get(getAUserDetail);

module.exports = router;
