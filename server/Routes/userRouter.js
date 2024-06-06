const express = require('express');
const router = express.Router();
const userController = require('../Controllers/userController');

router.get('/', userController.index);

router.get('/signup', userController.index);

router.post('/signup', userController.signup);

router.post('/signin', userController.signin);

router.post('/signout', userController.signout);

router.post('/search', userController.search);

router.post('/requests', userController.requests);

router.get('/notifications', userController.notifications);

module.exports = router;