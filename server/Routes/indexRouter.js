const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');

router.get('/', asyncHandler((req, res, next) => {
    res.json({ title: `Server Running.`, msg: `Server Running on Port:5000.` });
}));

module.exports = router;

