'use strict';

var _ = require('lodash');
var async = require('async');
var math = require('mathjs');
var models = require('../../models');
var Homework = models.Homework;
var Quiz = models.Quiz;
var Class = models.Class;
var Student = models.Student;

var api = {
    /**
     *
     * 创建家庭作业
     * @param req
     * @param res
     * @param next
     *
     */
    create: function (req, res, next) {
        var quiz = req.body;
        quiz.creator = req.user;
        quiz.creatorDisplayName = req.user.displayName;
        quiz.creatorUsername = req.user.username;
        quiz.schoolId = req.user.schoolId;
        quiz.asTemplate = !!req.body.addQuizBase;
        quiz = new Quiz(quiz);
        quiz.save(function (err, quiz) {
            if (err) {
                return next(err);
            }
            //开始给班级分配作业
            var classIds = req.body.classIds;
            if (!classIds) {
                return res.sendStatus(200);
            }
            var exerciseCount = quiz.exercises.length;
            var homeworkList = [];
            async.each(classIds, function (clazz, callback) {
                Student.find({classes: clazz}).select('_id')
                    .lean()
                    .exec(function (err, students) {
                        if (err) {
                            return callback(err);
                        }
                        if (students.length === 0) {
                            return callback();
                        }
                        var performances = _.map(students, function (student) {
                            return {student: student._id};
                        });
                        var homework = {
                            clazz: clazz,
                            keyPoint: req.body.keyPoint,
                            keyPointRecord: req.body.keyPointRecord,
                            finishAward: req.body.finishAward,
                            performanceAward: req.body.performanceAward,
                            performances: performances,
                            exerciseCount: exerciseCount,
                            quiz: quiz._id,
                            title: quiz.title,
                            schoolId: req.user.schoolId,
                            statistics: {
                                studentCount: performances.length,
                                studentCountOfFinished: 0
                            }
                        };
                        homeworkList.push(homework);
                        callback();
                    });
            }, function (err) {
                if (err) {
                    return next(err);
                }
                Homework.create(homeworkList, function (err) {
                    if (err) {
                        return next(err);
                    }
                    res.sendStatus(200);
                });
            });
        });
    },


    /**
     * 关闭当前作业
     * @param req
     * @param res
     * @param next
     *
     */
    close: function (req, res, next) {
        Homework.findById(req.params.homeworkId)
            .populate('performances.student username displayName')
            .populate('clazz className')
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
                homework.state = 1;
                homework.className = homework.clazz.className;
                homework.save(function (err) {
                    if (err) {
                        return next(err);
                    }
                    res.sendStatus(200);
                })
            });
    },


    /**
     *
     * 删除作业
     * @param req
     * @param res
     * @param next
     *
     */
    del: function (req, res, next) {
        Homework.findById(req.params.homeworkId, function (err, homework) {
            if (err || !homework || homework.state !== 0) {
                return next(err || '作业不存在或无法删除');
            }
            homework.remove(function (err) {
                if (err) {
                    return next(err);
                }
                // 如果删除的作业与练习是唯一映射，并且该练习没有设置为题库，则删除该练习
                Homework.count({quiz: homework.quiz}, function (err, count) {
                    if (count === 0) {
                        Quiz.remove({_id: homework.quiz, asTemplate: false}, function (err) {
                            if (err) {
                                console.error(err);
                            }
                        })
                    }
                });
                res.sendStatus(200);
            });
        });
    },


    /**
     *  评语
     * @param req
     * @param res
     * @param next
     */
    award: function (req, res, next) {
        var studentId = req.params.studentId;
        var homeworkId = req.params.homeworkId;
        var comment = {content: req.body.comment, teacher: req.user};
        Homework.update({
            _id: homeworkId,
            'performances.student': studentId
        }, {
            $set: {
                'performances.$.state': 2,
                'performances.$.comment': comment
            }
        }, function (err) {
            if (err) {
                return next(err);
            }
            res.sendStatus(200);
        });
    }
};

exports = module.exports = api;
