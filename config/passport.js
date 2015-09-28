'use strict';


var passport = require('passport');
var models = require('../app/models');
var roles = require('../app/common/constants').roles;
var path = require('path');
var config = require('./config');

module.exports = function () {

    // Serialize sessions
    passport.serializeUser(function (user, done) {
        done(null, {id: user._id.toString(), role: user.role});
    });

    // Deserialize sessions
    passport.deserializeUser(function (user, done) {
        var userProxy = user.role === roles.HEADMASTER ? models.School : models.Teacher;
        userProxy.findById(user.id, function (err, userInfo) {
            if (!userInfo) {
                return done(new Error('用户不存在'));
            }
            userInfo.role = user.role;
            done(err, userInfo);
        });
    });

    // Initialize strategie
    config.getGlobbedFiles('./config/strategies/**/*.js').forEach(function (strategy) {
        require(path.resolve(strategy))();
    });
};
