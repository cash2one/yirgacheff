'use strict'

var mongoose = require('mongoose'),
    _ = require('lodash'),
    teacherMenus = require('../../common/menus').teacherMenus,
    Question = mongoose.model('Question');
/**
 * 问题列表页面
 * @param req
 * @param res
 * @returns {*}
 */

exports.question = function (req, res) {
    return res.render('backend/teacher/questions/list-questions');
};
/**
 * 问题详情页面
 *
 *
 * */
exports.questioninfo = function (req, res, next ) {
    var questionId = req.params.questionId;
    Question.findById(questionId,function(err,question){
        if(err){
            return next(err);
        }
        return res.render('backend/teacher/questions/view-quest',{ question:question});
    });
};





