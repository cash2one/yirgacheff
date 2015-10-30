'use strict';

var _ = require('lodash');
var async = require('async');
var roles = require('../../common/constants').roles;
var models = require('../../models');
var Student = models.Student;
var Counter = models.Counter;
var Class = models.Class;

var api = exports = module.exports = {};

/**
 * 新建一个学生
 * @param req
 * @param res
 */
api.create = function (req, res, next) {
    var data = _.assign(req.body, {
        schoolId: req.user.schoolId,
        classes: req.params.classId,
        schoolNum: req.user.username.substr(0, 5)  // 学校编号
    });
    if (data.gender === '男') {
        data.avatar = '/images/avatar/children/default8.png';
    } else {
        data.avatar = '/images/avatar/children/default6.png';
    }
    Counter.generateSequence('student', data.schoolId, function (err, counter) {
        if (err) {
            return next(err);
        }
        var student = new Student(data);
        var seq = counter ? counter.seq : 0;
        student.username = data.schoolNum + roles.STUDENT + seq;
        student.save(function (err, student) {
            if (err) {
                return next(err);
            }
            res.json(student);
        });
    });
};

/**
 * 获取指定班级的学生列表
 * @param req
 * @param res
 */
api.getByClass = function (req, res, next) {

    if( req.query.draw && req.query.length){
        var qs = new RegExp(req.query.search['value']);
        async.parallel({
            "count": cb => Student.count({
                classes: req.params.classId,
                "$or":[{displayName: qs}, {username: qs}]
            },cb),
            "students": cb => Student.find({classes: req.params.classId, "$or":[{displayName: qs}, {username: qs}]})
                                    .skip(req.query.start)
                                    .limit(req.query.length)
                                    .lean()
                                    .exec(cb)
        },function(err,result){
            if(err){
                return next(err);
            }
            var page_students = {
                'draw': req.query.draw,
                'recordsTotal': result.count,
                'recordsFiltered': result.count,
                'data': result.students
            };
            res.json(page_students);
        });
    }else{
        Student.find({classes: req.params.classId})
            .lean()
            .exec(function (err, students) {
                if (err) {
                    return next(err);
                }
                res.json(students);
            });
    }
};


/**
 * 获取无班级学生
 * @param req
 * @param res
 */
api.getNoneClassStudents = function (req, res, next) {
    Student.find({schoolId: req.user.schoolId})
        .where('state', 0)
        .where('classes').size(0)
        .lean()
        .exec(function (err, students) {
            if (err) {
                return next(err);
            }
            res.json(students);
        });


};


/**
 *
 * 获取指定教师下的所有学生
 * @param req
 * @param res
 * @param next
 *
 */
api.getByTeacher = function (req, res, next) {

    if( req.query.draw && req.query.length){
        var qs = new RegExp(req.query.search['value']);
        Class.find({owner: req.params.teacherId, state: 0}, '_id', function (err, classes) {
            if (err) {
                return callback(err);
            }
            async.parallel({
                "count": cb => Student.count({
                    classes: {$in: classes},
                    "$or": [{displayName: qs}, {username: qs}]
                },cb),
                "students": cb =>  Student.find({classes: {$in: classes},"$or":[{displayName: qs}, {username: qs}]})
                                     .select('username displayName password gender onSchool')
                                     .skip(req.query.start)
                                     .limit(req.query.length)
                                     .lean().exec(cb)
            },function(err,result){
                if(err){
                    return next(err);
                }
                var page_students = {
                    'draw': req.query.draw,
                    'recordsTotal': result.count,
                    'recordsFiltered': result.count,
                    'data': result.students
                };
                res.json(page_students);
            });
        });

    }else{
        Class.find({owner: req.params.teacherId, state: 0}, '_id', function (err, classes) {
            if (err) {
                return callback(err);
            }
            Student.find({classes: {$in: classes}},
                'username displayName password gender onSchool',
                function (err, students) {
                    if (err) {
                        return next(err);
                    }
                    res.json(students);
                })
        });
    }
};

/**
 * 获取指定学校下的学生列表
 * @param req
 * @param res
 */
api.list = function (req, res, next) {

    if( req.query.draw && req.query.length) {
        var qs = new RegExp(req.query.search['value']);
        async.parallel({
            "count": cb => Student.count({
                    schoolId: req.user.schoolId,
                    state: 0,
                    '$or': [{displayName: qs}, {username: qs}]
                }, cb),
            "students": cb => Student.find({schoolId: req.user.schoolId, state: 0,'$or': [{displayName: qs}, {username: qs}]})
                    .select('username displayName password gender onSchool grade phone score')
                    .skip(req.query.start)
                    .limit(req.query.length)
                    .lean().exec(cb)
        }, function (err, result) {
            if (err) {
                return next(err);
            }
            var page_students = {
                'draw': req.query.draw,
                'recordsTotal': result.count,
                'recordsFiltered': result.count,
                'data': result.students
            };
            res.json(page_students);
        });
    }else{
        Student.find({schoolId: req.user.schoolId, state: 0})
            .select('username displayName password gender onSchool grade phone score')
            .lean().exec(function(err,data){
                if(err){
                    return next(err);
                }
                res.json(data);
            });
    }
};

/**
 * 获取指定学生信息
 * @param req
 * @param res
 * @param next
 */
api.read = function (req, res, next) {
    Student.findById(req.params.studentId, function (err, student) {
        if (err) {
            return next(student);
        }
        res.json(student);
    });
};

/**
 * 更新学生信息
 * @param req
 * @param res
 */
api.update = function (req, res, next) {
    Student.findByIdAndUpdate(req.params.studentId, req.body, {new: true},
        function (err, student) {
            if (err) {
                return next(err);
            } else {
                res.json(student);
            }
        });
};


/**
 * 删除学生(假删除)
 * @param req
 * @param res
 * @returns {*}
 */
//
api.deleteById = function (req, res, next) {
    var studentId = req.params.studentId;
    Student.findById(studentId, 'classes', function (err, student) {
        if (err || !student) {
            return next(err || '该学生不存在');
        }
        if (student.classes && student.classes.length > 0) {
            return next('该学生还有班级，不能删除');
        }
        Student.update({_id: student._id}, {$set: {state: 1}}, function (err) {
            if (err) {
                return next(err);
            }
            res.sendStatus(200);
        });
    });
};

/**
 * 将指定学生加入指定班级
 * @param req
 * @param res
 * @param next
 */
api.joinAClass = function (req, res, next) {
    function _callback(err, student) {
        if (err || !student || student.state === 1) {
            return next(err || '指定学生不存在');
        }
        Student.update({_id: student._id}, {$addToSet: {classes: req.params.classId}},
            function (err) {
                if (err) {
                    return next(err);
                }
                res.json(student);
            });
    }

    var studentId = req.params.studentId;
    if (studentId) {
        Student.findById(studentId, _callback);
    } else {
        Student.findOne({
            username: req.body.username,
            schoolId: req.user.schoolId
        }).exec(_callback);
    }
};

/**
 * 将指定学生退出指定班级
 * @param req
 * @param res
 */
api.quitAClass = function (req, res, next) {
    var studentId = req.params.studentId;
    var classId = req.params.classId;
    Student.update({_id: studentId}, {$pull: {classes: classId}}, function (err) {
        if (err) {
            return next(err);
        }
        res.sendStatus(200);
    });
};

/**
 * 积分奖励
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
api.scoreAward = function (req, res, next) {
    var operation = parseInt(req.body.operation);
    var value = parseInt(req.body.value);
    if (_.isNaN(operation) || _.isNaN(value)) {
        return next('非法参数');
    }
    value = operation === 0 ? value : (0 - value);
    Student.findById(req.params.studentId, 'score', function (err, student) {
        if (err) {
            return next(err);
        }
        var score = student.score + value;
        if (score < 0) {
            score = 0;
        }
        student.update({score: score}, function (err) {
            if (err) {
                return next(err);
            }
            res.json({
                score: score
            });
        });
    });
};





