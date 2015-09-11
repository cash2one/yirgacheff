/**
 * Created by Frank on 15/4/13.
 *
 * 权限验证中间件,用于api请求
 */

'use strict';

var _ = require('lodash');
var models = require('../models');
var roles = require('../common/constants').roles;
var utils = require('../common/utils');

/**
 * 需要登陆
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
exports.requiresLogin = function (req, res, next) {

    if (!req.isAuthenticated()) {
        return next('用户未登录');
    }
    next();
};

/**
 * 需要学校角色
 *
 */
exports.requireSchoolRole = function (req, res, next) {
    if (req.user.role !== roles.HEADMASTER) {
        return res.res.sendStatus(403);
    }
    next();
};

/**
 * 需要教师角色
 *
 */
exports.requireTeacherRole = function (req, res, next) {
    if (req.user.role !== roles.TEACHER) {
        return res.res.sendStatus(403);
    }
    next();
};

/**
 * 修改密码
 * @param req
 * @param res
 */
exports.modifyPassword = function (req, res) {
    var password = req.body.password;
    var newPassword = req.body.newPassword;
    var role = req.user.role;
    var UserModel = null;
    if (role === roles.HEADMASTER) {
        UserModel = models.School;
    } else if (role === roles.TEACHER) {
        UserModel = models.Teacher;
    }
    if (!UserModel) {
        return res.sendStatus(400);
    }
    UserModel.findById(req.user._id, function (err, user) {
        if (err) {
            return utils.error_400(res, err);
        }
        if (!user.authenticate(password)) {
            return res.status(400).json({message: '原始密码错误'});
        }
        user.password = newPassword;
        user.save(function (err) {
            if (err) {
                return utils.error_400(res, err);
            }
            res.sendStatus(200);
        });
    });
};
