'use strict';

var _ = require('lodash');
var async = require('async');
var models = require('../../models');
var Teacher = models.Teacher;
var Class = models.Class;
var Student = models.Student;

var api = exports = module.exports = {};

/**
 * 新建一个班级
 * @param req
 * @param res
 */
api.create = function (req, res, next) {
    var data = _.assign(req.body, {
        owner: req.user,
        ownerDisplayName: req.user.displayName,
        ownerUsername: req.user.username,
        schoolId: req.user.schoolId
    });
    Class.create(data, function (err, clazz) {
        if (err) {
            return next(err);
        } else {
            res.json(clazz);
        }
    });
};

/**
 * 获取指定班级资料
 * @param req
 * @param res
 * @returns {*|string}
 */
api.read = function (req, res, next) {
    Class.findById(req.params.classId)
        .lean()
        .exec(function (err, clazz) {
            if (err) {
                return next(err);
            } else {
                res.json(clazz);
            }
        });
};

/**
 * 获取当前学校的班级列表
 * @param req
 * @param res
 */
api.list = function (req, res, next) {
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
                if (err) {
                    return next(err);
                }
                res.json(classes);
            });
        });
};

/**
 * 获取当前教师的班级列表
 * @param req
 * @param res
 */
api.listMyClasses = function (req, res, next) {
    Class.find({owner: req.user, state: 0})
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
                if (err) {
                    return next(err);
                }
                res.json(classes);
            });
        });
};

/**
 * 转让班级
 * @param req
 * @param res
 */
api.changeOwner = function (req, res, next) {
    var username = req.body.username,
        classId = req.params.classId;
    Teacher.findOne({username: username})
        .select('_id state displayName username')
        .lean()
        .exec(function (err, teacher) {
            if (err || !teacher) {
                return next(err || '指定教师不存在');
            }
            if (teacher.state === 1) {
                return next('该教师已经禁用');
            }
            Class.update({_id: classId}, {
                $set: {
                    owner: teacher,
                    ownerDisplayName: teacher.displayName,
                    ownerUsername: teacher.username
                }
            }, function (err) {
                if (err) {
                    return next(err);
                } else {
                    res.sendStatus(200);
                }
            });
        });
};

/**
 * 获取指定教师班级列表
 * @param req
 * @param res
 *
 */
api.listByOwner = function (req, res, next) {
    Class.find({owner: req.params.teacherId, state: 0})
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
                if (err) {
                    return next(err);
                }
                res.json(classes);
            });
        });
};

/**
 * 修改班级资料
 * @param req
 * @param res
 */
api.update = function (req, res, next) {
    var className = req.body.className;
    if (!className) {
        return next('未提供修改信息');
    }
    Class.update({_id: req.params.classId}, {$set: {className: className}}, function (err) {
        if (err) {
            return next(err);
        }
        res.json({
            className: className
        });
    });
};


/**
 * 删除指定班级
 * @param req
 * @param res
 */
api.delete = function (req, res, next) {
    var classId = req.params.classId;
    Student.count({classes: classId}, function (err, count) {
        if (err) {
            return next(err);
        }
        if (count > 0) {
            return next(err || '该班级存在学生，无法删除');
        }
        // 执行假删除
        Class.update({_id: classId}, {
            $set: {state: 1},
            $unset: {owner: 1, ownerDisplayName: 1, ownerUsername: 1}
        }, function (err) {
            if (err) {
                return next(err);
            }
            res.sendStatus(200);
        });
    });
};

