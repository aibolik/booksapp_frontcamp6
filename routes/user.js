const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const UserModel = require('../models/user');
const jwt = require('jsonwebtoken');

mongoose.connect('mongodb://localhost:27017/frontcamp');
const db = mongoose.connection;

/* POST create a blog instance */
router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', (req, res) => {
    let user = new UserModel(req.body);
    user.save().then(createdUser => {
        let payload = { sub: createdUser._id, name: createdUser.name };
        let token = jwt.sign(payload, 'frontcamp');
        res.status(200).json({ token });
        // res.redirect('/blogs');
    });
});

module.exports = router;
