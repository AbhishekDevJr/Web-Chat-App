const express = require('express');
const router = express.Router();
const userController = require('../Controllers/userController');

router.get('/', userController.index);

router.get('/signup', userController.signup);

router.post('/signup', userController.signup);

module.exports = router;