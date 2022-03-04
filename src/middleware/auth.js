const jwt = require('jsonwebtoken');
require('dotenv').config();


exports.verifyToken = (req, res, next) => {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        jwt.verify(bearerToken, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                res.status(401).json({
                    message: 'Unauthorized'
                });
            } else {
                req.user = user;
                next();
            }
        });
    } else {
        res.status(401).json({
            message: 'Unauthorized'
        });
    }
};


exports.verifyAdmin = (req, res, next) => {
    if (req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({
            message: 'Forbidden'
        });
    }
}
