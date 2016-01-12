/**
 * Created by Frank on 16/1/11.
 */
'use strict';

const co = require('co');
const mongoose = require('mongoose');
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
    })

};