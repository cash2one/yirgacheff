'use strict';

var _ = require('lodash');
var models = require('../../models');
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




