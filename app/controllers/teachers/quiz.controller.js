'use strict';
var mongoose = require('mongoose'),
    _ = require('lodash'),
    teacherMenus = require('../../common/menus').teacherMenus,
    Quiz = mongoose.model('Quiz');

/**
 * 新建题库
 * @param req
 * @param res
 * @returns {*}
 */
exports.quizCreate = function (req, res) {
    return res.render('backend/teacher/quizBase/create-quiz', teacherMenus.quizzes);
};


/**
 * 题库列表
 * @param req
 * @param res
 * @returns {*}
 */
exports.quizManager = function (req, res, next) {
            return res.render('backend/teacher/quizBase/list-quizzes',teacherMenus.quizzes);
};

/**
 * 题库详情
 * @param req
 * @param res
 * @returns {*}
 */
exports.quizDetail = function (req, res, next) {
    var quizId = req.params.quizId;
    Quiz.findById(quizId, function (err, quiz) {
        if (err) {
            return next(err);
        }
        return res.render('backend/teacher/quizBase/view-quiz',
            _.assign({
                quiz: quiz
            }, teacherMenus.quizzes));
    });
};
