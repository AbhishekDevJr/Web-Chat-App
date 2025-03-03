const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

exports.auth = asyncHandler(async (req, res, next) => {
    try {
        const token = req?.cookies?.token;
        console.log('Server Auth----------------->', token);

        if (!token) {
            res.clearCookie('token', {
                domain: '.vercel.app',
                path: '/',
                sameSite: 'none',
                secure: true
            });
            res.clearCookie('userinfo', {
                domain: '.vercel.app',
                path: '/',
                sameSite: 'none',
                secure: true
            });
            return res.status(401).json({ title: 'Unathorized Access', msg: 'Access Denied. No Token Available.' });
        }

        const verified = jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
            if (err) {
                res.clearCookie('token', {
                    domain: '.vercel.app',
                    path: '/',
                    sameSite: 'none',
                    secure: true
                });
                res.clearCookie('userinfo', {
                    domain: '.vercel.app',
                    path: '/',
                    sameSite: 'none',
                    secure: true
                });
                return res.status(401).json({ title: 'Invalid JWT Token', msg: 'Invalid Auth JWT Token' });
            }
        });
        next();
    } catch (err) {
        console.log('Server Auth Error----------------->');

        res.clearCookie('token', {
            domain: '.vercel.app',
            path: '/',
            sameSite: 'none',
            secure: true
        });
        res.clearCookie('userinfo', {
            domain: '.vercel.app',
            path: '/',
            sameSite: 'none',
            secure: true
        });
        res.status(400).json({ title: 'Invalid JWT Token', msg: 'Invalid Auth JWT Token', redirectTo: '/signin' });
    }
});