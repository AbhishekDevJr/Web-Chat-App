const express = require('express');
const router = express.Router();
const userController = require('../Controllers/userController');

router.get('/', userController.index);

router.get('/signup', userController.signup);

router.post('/signup', (req, res, next) => {
    res.json({ firstName: req?.body?.firstName, lastName: req?.body?.lastName, email: req?.body?.email, password: req?.body?.password });
});

module.exports = router;