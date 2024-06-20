const express = require('express');
const asyncHandler = require('express-async-handler');

exports.index = asyncHandler((req, res, next) => {

    res.json({
        route: '/',
        method: 'GET',
        message: 'Welcome Everyone!'
    });
});