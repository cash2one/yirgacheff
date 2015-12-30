/**
 * Created by Frank on 15/12/23.
 */
'use strict';
const mongoose = require('mongoose');
const co = require('co');
const _ = require('lodash');
const queryBuilder = require('../functions/queryBuilder');
const createError = require('http-errors');
const Question = mongoose.model('Question');
const Teacher = mongoose.model('Teacher');

module.exports = {

    findBySchool: co.wrap(function*(schoolId, filter) {
        let query = Question.find({schoolId: schoolId});
        if (!_.isEmpty(filter)) {
            queryBuilder(query, filter);
        }
        return yield query.lean().exec();
    }),

    findById: co.wrap(function*(id, isLean) {
        let query = Question.findById(id);
        if (isLean === true) {
            query.lean();
        }
        return yield query.exec();
    }),

    addAnswer: co.wrap(function*(teacherId, questionId, answer) {
        if (!teacherId || !questionId || !answer) {
            throw createError(400, '参数错误');
        }
        if ('' === answer.trim()) {
            throw createError(400, '答案不能为空');
        }
        let teacher = yield Teacher.findById(teacherId).select('_id').lean().exec();
        if (!teacher) {
            throw createError(400, '教师不存在');
        }
        let question = yield Question.findById(questionId).exec();
        if (!question) {
            throw createError(400, '问题不存在');
        }
        question.answer = answer;
        question.state = 1;
        return yield question.save();
    })

};