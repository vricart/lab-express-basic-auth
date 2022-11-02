const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs');
const saltRounds = 10;

const User = require('../models/User.model');
const { default: mongoose } = require('mongoose');


router.get('/signup', (req, res) => { 
    res.render('auth/signup')
})

router.post('/signup', async (req, res, next) => {
    const {username, password} = req.body;

    const salt =  bcrypt.genSaltSync(saltRounds);
    const hash =  bcrypt.hashSync(password, salt);

    try {
        const userDB = await User.create({
            username,
            password: hash
        })
        console.log('new user created', userDB);
        res.redirect('/userProfile')

    } catch (error) {
        console.log(error)
    }

})

router.get('/userProfile', (req, res) => {
    res.render('users/user-profile')
})

module.exports = router;