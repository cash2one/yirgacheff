/**
 * Created by Frank on 2015/10/19.
 */
'use strict';

var _ = require('lodash');
var async = require('async');
var models = require('../../models');
var Question = models.Question;

var api = exports = module.exports = {};

/**
* 读取问题列表
* @param req
 * @param res
*/
api.list = function( req, res, next ) {
        Question.find({
            schoolId: req.user.schoolId,
            state: req.query.state
        }).select('-answer  -schoolId').populate('student', 'displayName username')
            .lean()
            .exec(function (err, question) {
                if (err) {
                    return next(err);
                }
                res.json(question);
            })
};

/**
 * 问题答案上传
 */

api.solve = function( req, res, next ){
    var data = {
        _id: req.body.questionId,
        answer: req.body.answer,
        state: 1,
        teacher: req.body.teacherId
    };
    Question.update({_id:data._id},data,function(err){
        if(err){
            return next(err);
        }
        res.send('save success');
    });
};













