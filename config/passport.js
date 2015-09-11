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
        var userProxy;
        switch (user.role) {
            case(roles.HEADMASTER):
                userProxy = models.School;
                break;
            case(roles.TEACHER):
                userProxy = models.Teacher;
                break;
            default:
                userProxy = models.Student;
        }
        userProxy.findById(user.id, function (err, userInfo) {
            userInfo.role = user.role;
            done(err, userInfo);
        });
    });

    // Initialize strategies
    config.getGlobbedFiles('./config/strategies/**/*.js').forEach(function (strategy) {
        require(path.resolve(strategy))();
    });
};
