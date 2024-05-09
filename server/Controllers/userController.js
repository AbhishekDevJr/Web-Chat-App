const express = require('express');
const asyncHandler = require('express-async-handler');

exports.index = asyncHandler((req, res, next) => {
    res.json({
        route: '/user',
        title: 'User Route',
        msg: 'User Routes Response',
        method: 'GET'
    });
});

exports.signup = asyncHandler((req, res, next) => {
    res.json({
        route: '/user/signup',
        method: 'GET',
        title: 'User SignUP API',
        msg: 'User SignUp API',
    });
});