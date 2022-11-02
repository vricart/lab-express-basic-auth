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

    if(!username || !password) {
        res.render('auth/signup', {
            errorMessage: 'All the fields should be filled'
        })
    }

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



router.get('/login', (req, res) => {
    res.render('auth/login')
})

router.post('/login', async (req, res) => {
    const {username, password} = req.body;

    if(!username || !password) {
        res.render('auth/login', {
            errorMessage: 'All the fields should be filled'
        })
            return;
    } 

    try {
        const userDB = await User.findOne({username})

        if(!userDB) {
            res.render('auth/login', {errorMessage: 'This username is not registered, Try again'})
        } else if (bcrypt.compareSync(password, userDB.password)) {
            console.log(userDB)
            res.render('users/user-profile', userDB)
        } else {
            res.render('auth/login', {errorMessage: 'Incorrect Password, Try Again'})
        }

    } catch (error){
        console.log(error)
    }
})





module.exports = router;