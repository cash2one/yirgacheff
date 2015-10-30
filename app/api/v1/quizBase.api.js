'use strict';

var _ = require('lodash');
var models = require('../../models');
var async = require('async');
var Quiz = models.Quiz;
var Homework = models.Homework;
var api = exports = module.exports = {};

/**
 *
 * 创建一个套题
 * @param req
 * @param res
 *
 */
api.create = function (req, res, next) {
    var quiz = new Quiz(_.assign(req.body, {
        creator: req.user,
        creatorDisplayName: req.user.displayName,
        creatorUsername: req.user.username,
        schoolId: req.user.schoolId
    }));

    quiz.save(function (err, quiz) {
        console.log(err);
        if (err) {
            return next(err);
        } else {
            res.json(quiz);
        }
    });

};

/**
 * 获取套题列表
 *
 *
 */
api.list = function(req, res, next){
    let query =  Quiz.find({schoolId: req.user.schoolId})
        .where('asTemplate', true)
        .select('-exercises')
        .populate('creator', 'displayName')
        .sort('-createdTime');
    if (req.query.draw && req.query.length) {
        let search = req.query.search.value;
        if (search && search.trim() != '') {
            query.or([{'creator.displayName': qs}, {title: qs}]);
        }
        async.parallel({
            count: cb => Quiz.count(query.getQuery(),cb),
            quizzes: cb => query
                .skip(req.query.start)
                .limit(req.query.length)
                .lean().exec(cb)
        }, function (err, result) {
            if (err) {
                return next(err);
            }
            res.json({
                draw: req.query.draw,
                data: result.quizzes,
                recordsTotal: result.count,
                recordsFiltered: result.count
            });
        });
    } else {
        query.lean()
            .exec(function (err, quizzes) {
                if (err) {
                    return next(err);
                }
                res.json(quizzes);
            });
    }
};




/**
 * 删除套题
 * @param req
 * @param res
 */
api.remove = function (req, res, next) {
    var quizId = req.params.quizId;
    Quiz.findByIdAndUpdate(quizId, {asTemplate: false}, function (err, quiz) {
        if (err) {
            return next(err);
        }
        Homework.count({quiz: req.params.quizId}, function (err, count) {
            if (count === 0) {
                quiz.remove(function (err) {
                    if (err) {
                        console.error(err);
                    }
                });
            }
            res.sendStatus(200);
        });
    });
};




