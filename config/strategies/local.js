'use strict';

/**
 * Module dependencies.
 */
const mongoose = require('mongoose');
const LocalStrategy = require('passport-local').Strategy;

module.exports = function(passport) {
    // Use local strategy
    passport.use(new LocalStrategy({
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true
        },
        function(req, username, password, done) {
            let UserModel = username.length === 5 ? mongoose.model('School') : mongoose.model('Teacher');
            UserModel.findOne({
                username: username
            }, 'username password salt schoolId state', function(err, user) {
                if (err) {
                    return done(err);
                }
                if (!user || !user.authenticate(password)) {
                    return done(new Error('用户名或密码错误'));
                }
                if (user.state === 1) {
                    return done(new Error('用户已经禁用'));
                }
                return done(null, user);
            });
        }
    ));
};