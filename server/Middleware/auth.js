const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

exports.auth = asyncHandler(async (req, res, next) => {
    try {
        const token = req?.cookies?.token;

        if (!token) {
            return res.status(401).json({ title: 'Unathorized Access', msg: 'Access Denied. No Token Available.' });
        }
        
        const verified = jwt.verify(token, 'myTokenSecretKey', (err, decoded) => {
            if (err) {
                return res.status(401).json({ title: 'Invalid JWT Token', msg: 'Invalid Auth JWT Token' });
            }
        });
        next();
    } catch (err) {
        res.status(400).json({ title: 'Invalid JWT Token', msg: 'Invalid Auth JWT Token', redirectTo: '/signin' });
    }
});