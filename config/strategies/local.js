'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    mongoose = require('mongoose');

module.exports = function () {
    // Use local strategy
    passport.use(new LocalStrategy({
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true
        },
        function (req, username, password, done) {
            var role = req.body.role;
            var UserModel;
            if (role === 'school') {
                UserModel = mongoose.model('School');
            } else if (role === 'teacher') {
                UserModel = mongoose.model('Teacher');
            } else {
                return done(new Error('缺少角色信息'));
            }
            UserModel.findOne({
                username: username
            }, 'username password salt schoolId state', function (err, user) {
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
