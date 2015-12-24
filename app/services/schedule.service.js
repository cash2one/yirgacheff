/**
 * Created by Frank on 15/12/21.
 */
'use strict';
const mongoose = require('mongoose');
const co = require('co');
const _ = require('lodash');
const createError = require('http-errors');
const queryBuilder = require('../functions/queryBuilder');
const Schedule = mongoose.model('Schedule');

module.exports = {

    findByUser: co.wrap(function*(userId, filter) {
        let query = Schedule.find({
            creator: userId
        });
        if (!_.isEmpty(filter)) {
            queryBuilder(query, filter);
        }
        return yield query.lean().exec();
    }),

    create: co.wrap(function*(user, data) {
        let schedule = new Schedule(data);
        _.assign(schedule, {
            creator: user._id,
            schoolId: user.schoolId
        });

        return yield schedule.save();
    }),

    updateById: co.wrap(function*(id, data) {
        let schedule = yield Schedule.findById(id);
        if (!schedule) {
            throw createError(400, '日程不存在');
        }
        _.assign(schedule, data);
        return yield schedule.save();
    }),

    deleteById: co.wrap(function*(id) {
        let schedule = yield Schedule.findById(id);
        if (!schedule) {
            throw createError(400, '日程不存在');
        }
        return yield schedule.remove();
    })

};