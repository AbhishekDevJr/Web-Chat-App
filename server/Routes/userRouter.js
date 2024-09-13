const express = require('express');
const router = express.Router();
const userController = require('../Controllers/userController');
const { auth } = require('../Middleware/auth');

router.get('/', userController.index);

router.get('/signup', userController.index);

router.post('/signup', userController.signup);

router.post('/signin', userController.signin);

router.post('/signout',  userController.signout);

router.post('/search',  userController.search);

router.post('/requests',  userController.requests);

router.get('/notifications',  userController.notifications);

router.post('/requests/accept',  userController.accept);

router.post('/requests/reject',  userController.reject);

module.exports = router;