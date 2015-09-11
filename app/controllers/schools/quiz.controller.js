'use strict';
var _ = require('lodash');
var schoolMenus = require('../../common/menus').schoolMenus;
var Quiz = require('../../models').Quiz;


/**
 * 题库列表
 * @param req
 * @param res
 * @returns {*}
 */
exports.quizManager = function (req, res, next) {
    Quiz.find({schoolId: req.user.schoolId, asTemplate: true})
        .select('-exercises')
        .sort('-createdTime')
        .lean()
        .exec(function (err, quizzes) {
            if (err) {
                return next(err);
            }
            return res.render('backend/school/quizBase/list-quizzes',
                _.assign({
                    quizzes: quizzes
                }, schoolMenus.quizzes));
        });
};

/**
 * 题库详情
 * @param req
 * @param res
 * @returns {*}
 */
exports.quizDetail = function (req, res, next) {
    var quizId = req.params.quizId;
    Quiz.findById(quizId).lean().exec(function (err, quiz) {
        if (err) {
            return next(err);
        }
        return res.render('backend/school/quizBase/view-quiz',
            _.assign({
                quiz: quiz
            }, schoolMenus.quizzes));
    });
};
