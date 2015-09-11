'use strict';
var mongoose = require('mongoose'),
    _ = require('lodash'),
    async = require('async'),
    teacherMenus = require('../../common/menus').teacherMenus,
    Class = require('../../proxy/').Class;

/**
 * 班级管理页面
 * @param req
 * @param res
 * @returns {*}
 */
exports.classManager = function (req, res) {
    return res.render('backend/teacher/manager/list-classes', teacherMenus.classManager);
};

/**
 * 学生管理页面
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
exports.studentManager = function (req, res, next) {

    Class.Model.find({owner: req.user, state: 0}, 'className')
        .lean().exec(function (err, classes) {
            if (err) {
                return next(err);
            }
            res.render('backend/teacher/manager/list-students',
                _.assign({
                    classes: classes,
                    selectedClass: req.query.clazz
                }, teacherMenus.studentManager));
        });
};


