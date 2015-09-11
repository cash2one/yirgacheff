/**
 * Created by Frank on 15/5/6.
 */
'use strict';

var async = require('async');
var _ = require('lodash');
var models = require('../../models');
var schoolMenus = require('../../common/menus').schoolMenus;
var Class = models.Class;
var Student = models.Student;
var Teacher = models.Teacher;

/**
 * 教师管理界面
 * @param req
 * @param res
 * @returns {*}
 */
exports.teacherManager = function (req, res) {
    return res.render('backend/school/manager/list-teachers',
        schoolMenus.teacherManager);

};

/**
 * 禁用教师列表
 * @param req
 * @param res
 * @returns {*}
 */
exports.disabledTeacherManager = function (req, res) {
    return res.render('backend/school/manager/list-teachers-disabled',
        schoolMenus.teacherManager);

};


/**
 * 学生管理界面
 * @param req
 * @param res
 * @param next
 */
exports.studentManager = function (req, res, next) {
    var user = req.user;
    async.parallel({
        students: function (callback) {
            Student.find({schoolId: user.schoolId, state: 0})
                .select('displayName username password gender onSchool')
                .lean()
                .exec(callback);
        },
        teachers: function (callback) {
            Teacher.find({schoolId: user.schoolId, state: 0})
                .select('displayName')
                .lean()
                .exec(callback);
        }
    }, function (err, results) {
        if (err) {
            return next(err);
        }
        return res.render('backend/school/manager/list-students',
            _.assign(results, schoolMenus.studentManager));
    });

};

/**
 * 未入班学生管理界面
 * @param req
 * @param res
 * @param next
 */
exports.studentManagerOfNoneClass = function (req, res, next) {
    Student.where('state', 0)
        .where('classes').size(0)
        .lean()
        .exec(function (err, students) {
            if (err) {
                return next(err);
            }
            return res.render('backend/school/manager/list-students-noneClass',
                _.assign({students: students}, schoolMenus.studentManager));
        });
};
/**
 * 班级管理
 * @param req
 * @param res
 */
exports.classesManager = function (req, res, next) {
    Class.find({schoolId: req.user.schoolId, state: 0})
        .lean()
        .exec(function (err, classes) {
            if (err) {
                return next(err);
            }
            async.each(classes, function (clazz, callback) {
                Student.count({classes: clazz}, function (err, count) {
                    clazz.studentsCount = count;
                    callback();
                });
            }, function (err) {
                return res.render('backend/school/manager/list-classes',
                    _.assign({classes: classes}, schoolMenus.classManager));
            });

        });
};

/**
 * 班级详情
 * @param req
 * @param res
 * @param next
 */
exports.classDetail = function (req, res, next) {
    async.parallel({
        students: function (callback) {
            Student.find({classes: req.params.classId},
                'username displayName password gender onSchool')
                .lean()
                .exec(callback);
        },
        clazz: function (callback) {
            Class.findById(req.params.classId, 'className ownerDisplayName', callback);
        }
    }, function (err, result) {
        if (err) {
            return next(err);
        }
        return res.render('backend/school/manager/view-class',
            _.assign(result, schoolMenus.classManager));
    });
};
