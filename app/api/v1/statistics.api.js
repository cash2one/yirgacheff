'use strict';
var _ = require('lodash');
var async = require('async');
var moment = require('moment');
var math = require('mathjs');
var ObjectId = require('mongoose').Types.ObjectId;
var utils = require('../../common/utils');
var models = require('../../models');
var Class = models.Class;
var Student = models.Student;
var Homework = models.Homework;
var Quiz = models.Quiz;
var Teacher = models.Teacher;

require('moment-range');

var api = exports = module.exports = {};


/**
 * 统计学生数量
 * @param req
 * @param res
 */
api.studentCount = function (req, res, next) {
    Student.count({schoolId: req.user.schoolId, state: 0},
        function (err, count) {
            if (err) {
                return next(err);
            }
            res.json(count);
        });
};

/**
 * 统计指定教师学生数量
 * @param req
 * @param res
 */
api.studentCountByTeacher = function (req, res, next) {
    Class.find({
        owner: req.params.teacherId
    }).select('_id').exec(function (err, classes) {
        Student.count({
            classes: {$in: classes}
        }, function (err, count) {
            if (err) {
                return next(err);
            }
            res.json(count);
        });
    });

};


/**
 * 统计班级数量
 * @param req
 * @param res
 */
api.classCount = function (req, res, next) {
    var conditions = {
        schoolId: req.user.schoolId,
        state: 0
    };
    if (req.params.teacherId) {
        conditions.owner = req.params.teacherId;
    }
    Class.count(conditions,
        function (err, count) {
            if (err) {
                return next(err);
            }
            res.json(count);
        });
};

/**
 * 统计作业数量
 * @param req
 * @param res
 */
api.homeworkCount = function (req, res, next) {
    var conditions = {
        schoolId: req.user.schoolId
    };
    if (req.params.teacherId) {
        conditions.creator = req.params.teacherId;
    }
    Homework.count(conditions, function (err, count) {
        if (err) {
            return next(err);
        }
        res.json(count);
    });
};

/**
 * 统计教师数量
 * @param req
 * @param res
 */
api.teacherCount = function (req, res, next) {
    Teacher.count({schoolId: req.user.schoolId, state: 0}, function (err, count) {
        if (err) {
            return next(err);
        }
        res.json(count);
    });
};


/**
 * 错题统计
 * @param req
 * @param res
 */
api.wrongCount = function (req, res, next) {
    var homeworkId = req.params.homeworkId;
    Homework.findById(homeworkId)
        .select('title quiz performances.wrongCollect')
        .populate('quiz', 'exercises.sequence')
        .lean()
        .exec(function (err, homework) {
            if (err || !homework) {
                return next(err || '作业不存在');
            }
            var categories = [],
                series = [],
                info = {
                    title: homework.title
                };
            _.forEach(homework.quiz.exercises, function (exercise) {
                categories.push('第' + exercise.sequence + '题');
            });
            var wrongMapper = _.chain(homework.performances)
                .pluck('wrongCollect')
                .flatten()
                .countBy('sequence').value();

            for (var i = 0; i < categories.length; i++) {
                var seq = i + 1 + '';
                series[i] = wrongMapper[seq] || 0;
            }
            res.json({info: info, series: series, categories: categories});
        });

};

/**
 * 学生入学统计
 * @param req
 * @param res
 */
api.studentsEnrol = function (req, res, next) {
    var type = req.query.type,
        start = null,
        end = null;
    if (type === 'lastSixMonths') {
        start = moment().subtract(5, 'month').startOf('month');
        end = moment().endOf('month');
    } else if (type === 'lastTwelveMonths') {
        start = moment().subtract(11, 'month').startOf('month');
        end = moment().endOf('month');
    } else {
        start = moment().subtract(1, 'year').startOf('year');
        end = moment().subtract(1, 'year').endOf('year');
    }
    var range = moment.range(start, end);
    Student.aggregate()
        .match({
            schoolId: new ObjectId(req.user.schoolId),
            createdTime: {$gte: range.start.toDate(), $lte: range.end.toDate()}
        })
        .project({
            _id: 0,
            gender: 1,
            yearMonth: {$dateToString: {format: "%Y-%m", date: "$createdTime"}},
        })
        .group({
            _id: {
                yearMonth: '$yearMonth',
                gender: '$gender'
            },
            studentsCount: {$sum: 1}
        })
        .exec(function (err, aggregates) {
            if (err) {
                return next(err);
            }
            var categories = [],
                series = [],
                boys = [],
                girls = [],
                total = [];
            range.by('month', function (moment) {
                categories.push(moment.format('YYYY-MM'));
            });
            aggregates = _.groupBy(aggregates, function (aggregate) {
                return aggregate._id.yearMonth;
            });
            for (var i = 0; i < categories.length; i++) {
                var aggregate = aggregates[categories[i]];
                var boyCount = 0, girlCount = 0, totalCount = 0;
                if (aggregate) {
                    var first = aggregate[0],
                        second = aggregate.length > 1 ? aggregate[1] : null;
                    boyCount = first._id.gender === '男' ? first.studentsCount : 0;
                    girlCount = first._id.gender === '女' ? first.studentsCount : 0;
                    if (boyCount === 0 && second) {
                        boyCount = second.studentsCount;
                    } else if (girlCount === 0 && second) {
                        girlCount = second.studentsCount;
                    }
                    totalCount = boyCount + girlCount;
                }
                boys[i] = boyCount;
                girls[i] = girlCount;
                total[i] = totalCount;
            }
            series[0] = boys;
            series[1] = girls;
            series[2] = total;
            res.json({
                series: series,
                categories: categories
            });
        });
};

/**
 * 题库贡献排行榜
 * @param req
 * @param res
 */
api.quizContributionRank = function (req, res, next) {
    async.parallel({
        quizzesCount: function (callback) {
            Quiz.count({schoolId: req.user.schoolId}, callback);
        },
        teachers: function (callback) {
            Quiz.aggregate()
                .match({
                    schoolId: new ObjectId(req.user.schoolId)
                })
                .project({
                    _id: 0,
                    creator: 1,
                    creatorDisplayName: 1
                })
                .group({
                    _id: '$creator',
                    quizzesCount: {$sum: 1},
                    displayName: {$first: '$creatorDisplayName'}
                })
                .sort({
                    quizzesCount: -1
                })
                .limit(10)
                .exec(callback);
        }
    }, function (err, result) {
        if (err) {
            return next(err);
        }
        var count = result.quizzesCount,
            teachers = result.teachers;
        if (count !== 0) {
            _.forEach(teachers, function (teacher) {
                teacher.quizzesPercent = math.round(teacher.quizzesCount / count, 3);
            });
        }
        res.json(teachers);
    });
};

/**
 * 教师所教学生数量排名
 * @param req
 * @param res
 */
api.studentsCountOfTaughtRank = function (req, res, next) {

    Class.aggregate()
        .match({
            schoolId: new ObjectId(req.user.schoolId),
            state: 0
        })
        .project({
            owner: 1,
            _id: 0,
            ownerDisplayName: 1
        })
        .group({
            _id: '$owner',
            classesCount: {$sum: 1},
            displayName: {$first: '$ownerDisplayName'}
        })
        .sort({
            classesCount: -1
        })
        .exec(function (err, teachers) {
            if (err) {
                return next(err);
            }
            var totalCountOfClass = _.sum(teachers, function (teacher) {
                return teacher.classesCount;
            });
            var topTenTeachers = _.take(teachers, 10);
            var topTenCount = 0;
            var series = [];
            if (totalCountOfClass > 0) {
                _.forEach(topTenTeachers, function (teacher) {
                    teacher.classesCountPercent = math.round((teacher.classesCount / totalCountOfClass), 3);
                    series.push([teacher.displayName, teacher.classesCount]);
                    topTenCount += teacher.classesCount;
                });
                series.push(['其他', totalCountOfClass - topTenCount]);
            }
            return res.json({
                teachers: topTenTeachers,
                series: series
            });
        });
};

// 根据积分数计算组距
function calculateInterval(score, groupNum) {
    if (score < 100) {
        return 10;
    }
    groupNum = groupNum || 10;
    var maxStr = score + '',
        firstNum = parseInt(maxStr[0]),
        figure = maxStr.length,
        max = 0;
    if (firstNum > 9) {
        max = math.pow(10, figure);
    } else {
        max = (firstNum + 1) * math.pow(10, figure - 1);
    }
    return max / groupNum;
}
/**
 * 积分分布统计
 * @param req
 * @param res
 */
api.scoreDistribution = function (req, res, next) {
    Student.find({schoolId: req.user.schoolId})
        .select('score -_id')
        .sort('-score')
        .limit(1)
        .exec(function (err, students) {
            if (err) {
                return next(err);
            }
            if (!students || students.length === 0) {
                return res.json({categories: [], series: []});
            }
            var maxScore = students[0].score,
                interval = calculateInterval(maxScore),
                categories = [],
                series = _.fill(new Array(10), 0);
            _.times(10, function (n) {
                var start = n * interval,
                    end = (n + 1) * interval;
                categories.push(start + ' - ' + end);
            });
            if (maxScore == 0) {
                return utils.success(res, {categories: categories, series: series});
            }
            var mapReduce = {
                query: {
                    schoolId: new ObjectId(req.user.schoolId),
                    state: 0
                },
                scope: {
                    interval: interval
                },
                map: function () {
                    var index = Math.floor(this.score / interval);
                    emit(index + '', 1);
                },
                reduce: function (key, values) {
                    return Array.sum(values);
                }
            };
            Student.mapReduce(mapReduce, function (err, results) {
                if (err) {
                    return next(err);
                }
                _.forEach(results, function (result) {
                    var index = parseInt(result._id);
                    series[index] = result.value;
                });
                res.json({categories: categories, series: series});
            });
        });
};


