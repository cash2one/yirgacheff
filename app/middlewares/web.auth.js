/**
 * Created by Frank on 15/4/13.
 *
 * 权限验证中间件，用于web请求
 *
 */


'use strict';

var _ = require('lodash'),
    mongoose = require('mongoose'),
    roles = require('../common/constants').roles,
    utils = require('../common/utils');

/**
 * 需要登陆
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
exports.requiresLogin = function (req, res, next) {
    var nextUrl = req.baseUrl + req.path;
    if (!req.isAuthenticated()) {
        return res.redirect('/login?next=' + nextUrl);
    }
    res.locals.user = req.user;
    next();
};

/**
 * 需要学校角色
 *
 */
exports.requireSchoolRole = function (req, res, next) {
    if (req.user.role !== roles.HEADMASTER) {
        return res.redirect('/')
    }
    next();
};

/**
 * 需要教师角色
 *
 */
exports.requireTeacherRole = function (req, res, next) {
    if (req.user.role !== roles.TEACHER) {
        return res.redirect('/')
    }
    next();
};



