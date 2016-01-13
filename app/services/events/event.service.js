/**
 * Created by Frank on 16/1/11.
 */
'use strict';

const co = require('co');
const mongoose = require('mongoose');
const createError = require('http-errors');
const queryBuilder = require('../../functions/queryBuilder');
const Event = mongoose.model('Event');

module.exports = {

    findBySchool: co.wrap(function*(schoolId, filter) {
        let query = Event.find({schoolId: schoolId});
        if (filter) {
            query = queryBuilder(query, filter);
        }
        return yield query.lean().exec();
    }),

    findById: co.wrap(function*(id, isLean) {
        let query = Event.findById(id);
        if (isLean === true) {
            query.lean();
        }
        return yield query.exec();
    }),

    deleteById: co.wrap(function*(id) {
        let event = yield Event.findById(id).select('_id').exec();
        if (!event) {
            throw createError(400, '活动不存在');
        }
        return yield event.remove();

    })

};