/**
 * Created by Frank on 15/12/21.
 */
'use strict';
const mongoose = require('mongoose');
const _ = require('lodash');
const co = require('co');
const createError = require('http-errors');
const queryBuilder = require('../functions/queryBuilder');

const Quiz = mongoose.model('Quiz');
const Homework = mongoose.model('Homework');

module.exports = {

    create: co.wrap(function*(user, data) {
        let quiz = new Quiz(data);
        _.assign(quiz, {
            creator: user._id,
            creatorDisplayName: user.displayName,
            creatorUsername: user.username,
            schoolId: user.schoolId
        });
        return yield quiz.save();
    }),


    findBySchool: co.wrap(function*(schoolId, filter) {
        let query = Quiz.find({
            schoolId: schoolId,
            asTemplate: true
        });
        if (!_.isEmpty(filter)) {
            queryBuilder(query, filter);
        }
        console.log(query.getQuery());
        return yield query.lean().exec();
    }),

    findById: co.wrap(function*(id, isLean) {
        let query = Quiz.findById(id);
        if (isLean === true) {
            query.lean();
        }
        return yield query.exec();
    }),

    useById: co.wrap(function*(id) {
        return yield Quiz.findByIdAndUpdate(id, {
            $inc: {usage: 1}
        }).lean().exec();

    }),

    deleteById: co.wrap(function*(id) {
        let quiz = yield Quiz.findById(id).select('_id').exec();
        if (!quiz) {
            throw createError(400, '套题不存在');
        }
        let count = yield Homework.count({quiz: quiz}).exec();
        if (count > 0) {
            quiz.asTemplate = false;
            return yield quiz.save();
        }
        return yield quiz.remove();
    }),

    countBySchool: co.wrap(function*(schoolId) {
        return yield Quiz.count({
            schoolId: schoolId,
            asTemplate: true
        }).exec();

    })

};