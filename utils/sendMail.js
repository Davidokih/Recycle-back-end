const nodeMailer = require('nodemailer');
const { google } = require('googleapis');
const path = require("path");
const ejs = require("ejs");
require("dotenv").config();

const CLIENT_ID = '73215684662-ad4k77rch37mpgoif51aanfg1o4l9idc.apps.googleusercontent.com';
const CLIENT_SECRET = "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";
const REFRESH_TOKEN = "1//04wFwvdBTUqksCgYIARAAGAQSNwF-L9IrXu9uzIybSmEwpE243UCVMvPiDqU0a_lcLYSU5LXIF3fFwqoKZH9kttYl2t7_ig1BYXI";
const REDIRECT_URL = "https://developers.google.com/oauthplayground";

const oAuthPass = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URL
);

oAuthPass.setCredentials({ refresh_token: REFRESH_TOKEN });

const sendMail = async (user, email, otp) => {
    try {
        const createToken = await oAuthPass.getAccessToken();

        const transport = nodeMailer.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: process.env.GMAIL_USERNAME,
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refresh_token: REFRESH_TOKEN,
                accessToken: createToken.token,
            },
        });

        const buildFile = path.join(__dirname, "../views/index.ejs");
        const data = await ejs.renderFile(buildFile, {
            name: user,
            otp: otp,
        });

        const mailOptions = {
            from: "Cross-Africa",
            to: email,
            subject: "Verification OTP",
            html: data,

        };
        const result = transport.sendMail(mailOptions);
        return result;
    } catch (error) {
        return error;
    }
};