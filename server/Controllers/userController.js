const express = require('express');
const asyncHandler = require('express-async-handler');
const UserModel = require('../Models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const FriendReqModel = require('../Models/friendRequest');

exports.index = asyncHandler(async (req, res, next) => {

    const allUsers = await UserModel.find();

    res.json({
        route: '/user',
        title: 'User Route',
        msg: 'User Routes Response',
        method: 'GET'
    });
});

exports.signup = asyncHandler(async (req, res, next) => {
    try {
        if (req?.body?.firstName && req?.body?.lastName && req?.body?.email && req?.body?.password) {
            const userExists = await UserModel.findOne({ email: req?.body?.email });

            if (userExists) {
                res.json({
                    title: 'User Exists',
                    msg: `${req?.body?.email} User already Exists.`
                });
            } else {
                const salt = await bcrypt.genSalt(10);
                const hashedPass = await bcrypt.hash(req?.body?.password, salt);
                const newUser = new UserModel({ ...req?.body, password: hashedPass, createdAt: new Date() });
                newUser.save();

                res.json({
                    title: 'User Registered',
                    msg: `${req?.body?.email} User Registered. Redirecting to Login Page.`
                });
            }
        }
        else {
            res.status(400).json({
                title: 'Bad Request',
                msg: 'Bad Request Payload.'
            });
        }
    }
    catch (err) {
        res.status(500).json({
            title: 'Unhandled Exception',
            msg: `Unhandled Server Error. ${err?.message}`
        });
    }
});

exports.signin = asyncHandler(async (req, res, next) => {
    try {
        if (req?.body?.username && req?.body?.password) {
            const userExists = await UserModel.findOne({ email: req?.body?.username });

            if (userExists) {
                const isPasswordCorrect = await bcrypt.compare(req?.body?.password, userExists?.password);

                if (isPasswordCorrect) {
                    const token = jwt.sign({ username: userExists?.email }, `myTokenSecretKey`, { expiresIn: '1H' });


                    res.status(200).cookie('token', token, {
                        // maxAge: 3600000,
                        sameSite: 'lax',
                        httpOnly: true,
                        secure: false,
                    }).json({
                        title: 'Authentication Successful',
                        msg: 'User Successfully Authenticated.'
                    });
                }
                else {
                    res.json({
                        title: 'Authentication Failed',
                        msg: 'Incorrect Password.'
                    });
                }
            }
            else {
                res.json({
                    title: 'User Not Exists',
                    msg: `${req?.body?.username} Does Not Exists.`
                });
            }
        } else {
            res.status(400).json({
                title: 'Bad Request',
                msg: 'Bad Request Payload.'
            });
        }
    }
    catch (err) {
        res.status(500).json({
            title: 'Unhandled Exception',
            msg: `Unhandled Server Error. ${err?.message}`
        });
    }
});

exports.signout = asyncHandler(async (req, res, next) => {
    try {
        const jwtToken = req?.cookies.token;

        if (jwtToken) {
            res.clearCookie('token', { path: '/' });
            res.status(200).json({
                title: `Logged Out`,
                msg: `Logged Out Successfully.`
            });
        } else {
            res.status(400).json({
                title: `Bad Request`,
                msg: `Bad Request Payload.`
            });
        }

    } catch (err) {
        res.status(500).json({
            title: `Unhandled Exception`,
            msg: `Unhandled Server Error.`
        });
    }
});

exports.search = asyncHandler(async (req, res, next) => {
    try {
        const searchStr = req?.body?.username;

        if (searchStr) {
            const userExists = await UserModel.findOne({ email: searchStr });

            if (userExists) {
                res.status(200).json({
                    title: `User Found`,
                    msg: `User Found`,
                    username: userExists?.email,
                    firstName: userExists?.firstName,
                    lastName: userExists?.lastName
                });
            }
            else {
                res.status(200).json({
                    title: `User Not Found`,
                    msg: `User Not Found.`
                });
            }
        }
        else {
            res.status(400).json({
                title: `Bad Request`,
                msg: `Bad Request Payload.`
            });
        }

    } catch (err) {
        res.status(500).json({
            title: `Unhandled Exception`,
            msg: `Unhandled Server Error.`
        });
    }
});

exports.requests = asyncHandler(async (req, res, next) => {
    try {
        const username = req?.body?.username;

        if (username) {
            const userExists = await UserModel.findOne({ email: username });

            if (userExists) {
                const token = req?.cookies?.token;

                try {
                    const decoded = jwt.verify(token, 'myTokenSecretKey');
                    const currUserName = decoded?.username;

                    const sender = await UserModel.findOne({ email: currUserName });
                    const senderId = sender._id;

                    const receiver = await UserModel.findOne({ email: username });
                    const receivedId = receiver._id;

                    const requestExists = await FriendReqModel.findOne({ sender: senderId, receiver: receivedId });

                    if (requestExists) {
                        res.status(200).json({
                            title: `Request Already Exists`,
                            msg: 'You have already sent request to this User.'
                        });
                    }
                    else {
                        const newReq = new FriendReqModel({ sender: senderId, receiver: receivedId, status: 'pending', createdAt: new Date() });
                        newReq.save();

                        res.status(200).json({
                            title: `Friend Request Sent`,
                            msg: `Friend Request Sent Successfully.`
                        });
                    }

                } catch (err) {
                    res.status(500).json({
                        title: `Unhandled Exception`,
                        msg: `Unhandled Server Error.`
                    });
                }

            } else {
                res.status(200).json({
                    title: `User Not Found`,
                    msg: `User Not Found.`
                });
            }
        }
        else {
            res.status(400).json({
                title: `Bad Request`,
                msg: `Bad Request Payload.`
            });
        }
    }
    catch (err) {
        res.status(500).json({
            title: `Unhandled Exception`,
            msg: `Unhandled Server Error.`
        });
    }
});

exports.notifications = asyncHandler(async (req, res, next) => {
    try {
        const token = req?.cookies?.token;
        const decoded = jwt.verify(token, 'myTokenSecretKey');
        const currUserName = decoded?.username;

        const userId = await UserModel.findOne({ email: currUserName });

        if (String(userId._id)) {
            const userFriendRequestsCursor = await FriendReqModel.find({ receiver: String(userId._id) });

            const userRequestIds = userFriendRequestsCursor.map((item) => String(item.sender));
            const userRequests = await UserModel.find({ _id: { $in: userRequestIds } });
            const userRequestsRes = userRequests.map((item) => ({ firstName: item.firstName, lastName: item.lastName, email: item.email, createdAt: item.createdAt }));

            if (userRequests.length) {
                res.status(200).json({
                    title: `Request User Data`,
                    msg: `Friend Request User Data for Current User.`,
                    data: userRequestsRes
                });
            }
            else {
                res.status(200).json({
                    title: `No Friend Requests Found`,
                    msg: `No Friend Requests found for current user.`,
                    data: []
                });
            }
        }
        else {
            res.status(500).json({
                title: `Unhandled Exception`,
                msg: `Unhandled Server Error.`
            });
        }

    } catch (err) {
        res.status(500).json({
            title: `Unhandled Exception`,
            msg: `Unhandled Server Error.`
        });
    }
});