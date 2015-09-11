'use strict';
var mongoose = require('mongoose');
var _ = require('lodash');
var math = require('mathjs');
var async = require('async');
var models = require('../../models');
var teacherMenus = require('../../common/menus').teacherMenus;
var states = require('../../common/constants').states;
var Student = models.Student;
var Homework = models.Homework;
var Quiz = models.Quiz;
var Class = models.Class;


/**
 * 出作业
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
exports.homeworkCreate = function (req, res, next) {
    var quizId = req.query.quizId;
    async.parallel({
        classes: function (callback) {
            Class.find({owner: req.user}, 'className').lean().exec(callback);
        },
        quiz: function (callback) {
            if (!quizId) {
                return callback(null);
            }
            Quiz.findByIdAndUpdate(quizId, {$inc: {usage: 1}}).lean().exec(callback);
        }
    }, function (err, result) {
        if (err) {
            return next(err);
        }
        return res.render('backend/teacher/homework/create-homework',
            _.assign(result, teacherMenus.homework.create));
    });
};


/**
 * 作业列表
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
exports.homeworkManager = function (req, res, next) {
    Class.find({owner: req.user}, '_id', function (err, classes) {
        if (err) {
            return next(err);
        }
        Homework.where('clazz').in(classes)
            .where('state', 0)
            .sort('-createdTime')
            .select('-performances')
            .populate('clazz className')
            .lean()
            .exec(function (err, homeworkList) {
                if (err) {
                    return next(err);
                }
                return res.render('backend/teacher/homework/list-homework',
                    _.assign({homeworkList: homeworkList}, teacherMenus.homework.list));
            });

    });
};


/**
 * 班级作业详情
 * @param req
 * @param res
 * @returns {*}
 */
exports.homeworkClassDetail = function (req, res, next) {
    Homework.findById(req.params.homeworkId)
        .populate('performances.student username displayName')
        .lean()
        .exec(function (err, homework) {
            if (err || !homework) {
                return next(err || '作业不存在');
            }
            var statistics = homework.statistics;
            var finishedStudents = _.filter(homework.performances, function (performance) {
                return performance.state !== 0;
            });
            var finishedCount = statistics.studentCountOfFinished;
            if (finishedCount > 0) {
                //计算完成率
                statistics.finishRate = math.round(finishedCount / statistics.studentCount, 2);

                //计算错误率
                var totalWrongExercisesCount = _.sum(finishedStudents, function (student) {
                    return student.wrongCollect ? student.wrongCollect.length : 0;
                });
                statistics.wrongRate = math.round(totalWrongExercisesCount / (finishedCount * homework.exerciseCount), 2);
                //计算平均完成时间
                var totalSpendSeconds = _.sum(finishedStudents, function (student) {
                    return student.spendSeconds;
                });
                statistics.averageSpendSeconds = math.round(totalSpendSeconds / finishedCount, 0);
            }
            return res.render('backend/teacher/homework/view-classDetail', _.assign({
                homework: homework
            }, teacherMenus.homework.list));
        });
};


/**
 * 学生作业详情
 * @param req
 * @param res
 * @returns {*}
 */
exports.homeworkStudentDetail = function (req, res, next) {
    async.parallel({
        student: function (callback) {
            Student.findById(req.params.studentId).lean().exec(callback);
        },
        homework: function (callback) {
            Homework.findOne({_id: req.params.homeworkId},
                {performances: {$elemMatch: {student: req.params.studentId}}})
                .select('quiz')
                .populate('quiz', 'exercises')
                .lean()
                .exec(callback);
        }
    }, function (err, result) {
        if (err || !result.homework || !result.student) {
            return next(err || '请求错误');
        }
        var homework = result.homework;
        var performance = homework.performances[0];
        var exercises = homework.quiz.exercises;
        performance.homeworkId = homework._id.toString();
        var wrongCollect = performance.wrongCollect || [];
        var audioAnswers = performance.audioAnswers || [];

        // 标记错题
        _.forEach(wrongCollect, function (wrong) {
            exercises[wrong.sequence - 1].wrongAnswer = wrong.answer;
        });

        // 填充录音答案
        _.forEach(audioAnswers, function (audioAnswer) {
            exercises[audioAnswer.sequence - 1].audioAnswer = audioAnswer.answer;
        });

        return res.render('backend/teacher/homework/view-studentDetail',
            _.assign({
                student: result.student,
                performance: performance,
                exercises: exercises
            }, teacherMenus.homework.list));
    });
};


/**
 * 历史作业列表
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
exports.homeworkHistory = function (req, res, next) {
    Class.find({owner: req.user}, '_id')
        .lean()
        .exec(function (err, classes) {
            if (err) {
                return next(err);
            }
            Homework.where('clazz').in(classes)
                .where('state', 1)
                .sort('-createdTime')
                .select('-performances')
                .lean()
                .exec(function (err, homeworkList) {
                    if (err) {
                        return next(err);
                    }
                    return res.render('backend/teacher/homework/list-homework-history',
                        _.assign({homeworkList: homeworkList}, teacherMenus.homework.history));
                });
        });
};

/**
 * 班级作业历史详情
 * @param req
 * @param res
 * @returns {*}
 */
exports.homeworkHistoryClassDetail = function (req, res, next) {
    Homework.findById(req.params.homeworkId)
        .populate('performances.student', 'displayName username')
        .lean()
        .exec(function (err, homework) {
            if (err) {
                return next(err);
            }
            return res.render('backend/teacher/homework/view-classDetail-history',
                _.assign({
                    homework: homework
                }, teacherMenus.homework.history));
        });
};


/**
 * 学生作业历史详情
 * @param req
 * @param res
 * @param next
 */
exports.homeworkHistoryStudentDetail = function (req, res, next) {

    async.parallel({
        student: function (callback) {
            Student.findById(req.params.studentId).lean().exec(callback);
        },
        homework: function (callback) {
            Homework.findOne({_id: req.params.homeworkId},
                {performances: {$elemMatch: {student: req.params.studentId}}})
                .select('quiz')
                .populate('quiz', 'exercises')
                .lean()
                .exec(callback);
        }
    }, function (err, result) {
        if (err || !result.homework || !result.student) {
            return next(err || '请求错误');
        }
        var homework = result.homework;
        var performance = homework.performances[0];
        var exercises = homework.quiz.exercises;
        performance.homeworkId = homework._id.toString();
        var wrongCollect = performance.wrongCollect || [];
        var audioAnswers = performance.audioAnswers || [];

        // 标记错题
        _.forEach(wrongCollect, function (wrong) {
            exercises[wrong.sequence - 1].wrongAnswer = wrong.answer;
        });

        // 填充录音答案
        _.forEach(audioAnswers, function (audioAnswer) {
            exercises[audioAnswer.sequence - 1].audioAnswer = audioAnswer.answer;
        });

        return res.render('backend/teacher/homework/view-studentDetail-history',
            _.assign({
                student: result.student,
                performance: performance,
                exercises: exercises
            }, teacherMenus.homework.list));
    });
};


