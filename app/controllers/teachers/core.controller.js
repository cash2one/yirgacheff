'use strict';
var mongoose = require('mongoose');
var _ = require('lodash');
var async = require('async');
var teacherMenus = require('../../common/menus').teacherMenus;
var states = require('../../common/constants').states;
var models = require('../../models');
var Homework = models.Homework;
var Teacher = models.Teacher;
var Class = models.Class;

/**
 * 首页
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
exports.index = function (req, res, next) {
    Class.find({owner: req.user, state: 0}, function (err, classes) {
        if (err) {
            return next(err);
        }
        Homework.where('clazz').in(classes)
            .where('state', 0)
            .select('clazz')
            .populate('clazz className').
            lean().exec(function (err, homeworkList) {
                if (err) {
                    return next(err);
                }
                var rs = {};
                rs.homeworkCount = homeworkList.length;
                rs.classes = classes;
                rs.homeworkList = _.take(homeworkList, 3);
                res.render('backend/teacher/home', _.assign(rs, teacherMenus.home));
            });
    });

};

/**
 * 个人信息页面
 * @param req
 * @param res
 * @returns {*}
 */
exports.profile = function (req, res) {
    return res.render('backend/teacher/profile');
};

/**
 * 录音说明信息
 * @param req
 * @param res
 * @returns {*}
 */
exports.audioGuider = function (req, res) {
    return res.render('backend/teacher/audio-guider');
}
