'use strict';

var _ = require('lodash');
var passport = require('passport');
var roles = require('../common/constants').roles;
var url = require('url');


/**
 * 登陆界面
 * @param req
 * @param res
 */
exports.showLogin = function (req, res) {
    return res.render('backend/login');
};

/**
 * 登陆
 * @param req
 * @param res
 * @param next
 */
exports.login = function (req, res, next) {
    passport.authenticate('local', function (err, user) {
        if (err || !user) {
            res.render('backend/login', {error: (err && err.message) || '用户不存在'});
        } else {
            user.password = undefined;
            user.salt = undefined;
            req.login(user, function (err) {
                if (err) {
                    return next(err);
                }
                var next = url.parse(req.get('referer'), true).query.next;
                res.redirect(next || '/');
            });
        }
    })(req, res, next);
};

/**
 * 登出
 * @param req
 * @param res
 */
exports.logout = function (req, res) {
    req.logout();
    res.redirect('/login');
};


function indexByUser(user) {
    if (!user) {
        return '/login';
    }
    if (user.role === roles.HEADMASTER) {
        return '/school';
    }
    if (user.role === roles.TEACHER) {
        return '/teacher'
    }
}

/**
 * 首页
 * @param req
 * @param res
 */
exports.index = function (req, res) {
    var user = req.user;
    return res.redirect(indexByUser(user));
};

