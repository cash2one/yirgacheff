'use strict';

var _ = require('lodash');
var models = require('../../models');
var roles = require('../../common/constants').roles;
var Class = models.Class;
var Quiz = models.Quiz;
var Teacher = models.Teacher;
var Counter = models.Counter;
var api = exports = module.exports = {};


/**
 * 新建一个教师
 * @param req
 * @param res
 */
api.create = function (req, res, next) {
    var data = _.assign(req.body, {schoolId: req.user.schoolId, schoolNum: req.user.username});
    Counter.generateSequence('teacher', data.schoolId, function (err, counter) {
        if (err) {
            return next(err);
        }
        var teacher = new Teacher(data);
        var seq = counter ? counter.seq : 0;
        teacher.username = data.schoolNum + roles.TEACHER + seq;
        teacher.save(function (err, teacher) {
            if (err) {
                return next(err);
            }
            res.json(teacher);
        });
    });
};

/**
 * 获取单个教师信息
 * @param req
 * @param res
 * @returns {*|string}
 */
api.read = function (req, res, next) {
    var id = req.params.teacherId;
    Teacher.findById(id, function (err, teacher) {
        if (err) {
            return next(err);
        }
        res.json(teacher);
    });
};

/**
 * 更新教师信息
 * @param req
 * @param res
 */
api.update = function (req, res, next) {
    var teacherId = req.params.teacherId;
    Teacher.findById(teacherId, '_id', function (err, teacher) {
        if (err || !teacher) {
            return next(err || '教师不存在');
        }
        Teacher.findByIdAndUpdate(teacherId, req.body, {new: true}, function (err, updatedTeacher) {
            if (err) {
                return next(err);
            } else {
                var displayName = updatedTeacher.displayName;
                if (teacher.displayName !== displayName) {
                    Class.update({owner: teacherId},
                        {ownerDisplayName: displayName}, {multi: true},
                        function (err) {
                            if (err) {
                                console.error(err);
                            }
                        });
                    Quiz.update({creator: teacherId}, {creatorDisplayName: displayName},
                        {multi: true}, function (err) {
                            if (err) {
                                console.error(err);
                            }
                        });
                }
                res.json(updatedTeacher);
            }
        });
    });
};

api.avatar = function (req, res, next) {
    var file = req.file;
    if (!file) {
        return next('没有需要修改的头像文件');
    }
    Teacher.update({_id: req.user._id}, {avatar: file.key}, function (err) {
        if (err) return next(err);
        res.sendStatus(200);
    });
};

//教师禁用
api.disable = function (req, res, next) {
    Class.count({
        state: 0,
        owner: req.params.teacherId
    }, function (err, count) {
        if (err || count > 0) {
            return next(err || '该教师还有班级，不能禁用');
        }
        Teacher.update({_id: req.params.teacherId}, {state: 1}, function (err) {
            if (err) {
                return next(err);
            } else {
                res.sendStatus(200);
            }
        });
    });
};

//教师启用
api.enable = function (req, res, next) {
    Teacher.update({_id: req.params.teacherId}, {state: 0}, function (err) {
        if (err) {
            return next(err);
        } else {
            res.sendStatus(200);
        }
    });
};

/**
 * 获取教师列表
 * @param req
 * @param res
 */
api.list = function (req, res, next) {
    Teacher.find({
        schoolId: req.user.schoolId,
        state: 0
    }).select('displayName username password contact department')
        .lean()
        .exec(function (err, teachers) {
            if (err) {
                return next(err);
            } else {
                res.json(teachers);
            }
        });
};

/**
 * 获取禁用老师列表
 * @param req
 * @param res
 */
api.listDisabled = function (req, res, next) {
    Teacher.find({
        schoolId: req.user.schoolId,
        state: 1
    }).select('displayName username password contact department')
        .lean()
        .exec(function (err, teachers) {
            if (err) {
                return next(err);
            } else {
                res.json(teachers);
            }
        });
};

