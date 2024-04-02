const jwt = require("jsonwebtoken");
require("dotenv").config;

module.exports = async (req, res, next) => {
    try {
        if (!req.headers.authorization) throw "Forbidden";
        const token = req.headers.authorization.split(" ")[ 1 ];
        const payload = jwt.verify(token, process.env.JWT_SECRET, (err, res) => {
            if (err) {
                return 'expired token';
            }
            return res;
        });

        if (user == 'expired token') return res.json({ status: 'Error', data: 'expired token' });

        req.user = payload;

        next();
    } catch (error) {
        res.status(401).json({ message: "Forbidden" });
        // console.log(error);
    }
};