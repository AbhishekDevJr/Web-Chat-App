const express = require('express');
const router = express.Router();
const userController = require('../Controllers/userController');
const { auth } = require('../Middleware/auth');

router.get('/', userController.index);

router.get('/signup', userController.index);

router.post('/signup', userController.signup);

router.post('/signin', userController.signin);

router.post('/signout', auth, userController.signout);

router.post('/search', auth, userController.search);

router.post('/requests', auth, userController.requests);

router.get('/notifications', auth, userController.notifications);

router.post('/requests/accept', auth, userController.accept);

router.post('/requests/reject', auth, userController.reject);

module.exports = router;