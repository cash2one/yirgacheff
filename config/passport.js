'use strict';

var models = require('../app/models');
var roles = require('../app/common/constants').roles;

module.exports = function (passport) {

    // Serialize sessions
    passport.serializeUser(function (user, done) {
        done(null, {id: user._id.toString(), role: user.role});
    });

    // Deserialize sessions
    passport.deserializeUser(function (user, done) {
        console.log('execute deserializeUser .. ');
        var userProxy = user.role === roles.HEADMASTER ? models.School : models.Teacher;
        userProxy.findById(user.id, function (err, userInfo) {
            if (!userInfo) {
                return done(new Error('用户不存在'));
            }
            userInfo.role = user.role;
            done(err, userInfo);
        });
    });

    require('./strategies/local.js')(passport);
};
