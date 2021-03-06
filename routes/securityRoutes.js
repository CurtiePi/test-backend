const express = require('express');
const passport = require('passport');
const log = require('../libs/log')(module);
const User = require('../models/user.js');

const router = express.Router();

/**
 * Route that handles user registration
 * 
 * @param passport object
 *
 * @ return { router }
 **/
module.exports = (passport) => {
    router.post('/register', (req, res) => {
        let body = req.body;

        User.findOne({username: username})
            .then((record) => {

                if (record) {
                    res.status(500).send('Username already exists!');
                } else {
                    let newUser = new User();
                    newUser.username = username;
                    newUser.password = newUser.encryptPassword(password);

                     newUser.save()
                            .then((user) => {
                                res.redirect('/login');
                            })
                            .catch((err) => {
                               log.error(err);
                               res.status(500).send('There was a database error!');
                            });
                 } 
            })
            .catch((err) => {
                res.status(500).send('Houston we have a problem!');
            });
    });

    router.post('/login', passport.authenticate('local-web', {
        failureRedirect:'/',
        successRedirect:'/user/list'
    }), (req, res) => {
        res.send('Welcome to the thunderdome!');
    });

    router.post('/gettoken', passport.authenticate('local-api', {session: false}),
    (req, res) => {
        res.send({token: req.user});
    });

    return router;
};

