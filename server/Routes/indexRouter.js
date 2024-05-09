const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const indexController = require('../Controllers/indexController');

router.get('/', indexController.index);

module.exports = router;

