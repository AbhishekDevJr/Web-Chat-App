const express = require('express');
const router = express.Router();

router.get('/signup', (req, res, next) => {
    res.json({ title: 'SignUp API', msg: 'SignUP API Response' });
});

router.post('/signup', (req, res, next) => {
    res.json({ firstName: req?.body?.firstName, lastName: req?.body?.lastName, email: req?.body?.email, password: req?.body?.password });
});

module.exports = router;