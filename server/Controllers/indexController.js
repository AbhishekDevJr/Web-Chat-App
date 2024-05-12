const express = require('express');
const asyncHandler = require('express-async-handler');

exports.index = asyncHandler((req, res, next) => {
    console.log('Req Cookie---------->', req?.cookies);

    res.json({
        route: '/',
        method: 'GET',
        message: 'Welcome Everyone!'
    });
});