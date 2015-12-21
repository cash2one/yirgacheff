/**
 * Created by Frank on 15/12/21.
 */
'use strict';
const mongoose = require('mongoose');
const co = require('co');
const _ = require('lodash');
const createError = require('http-errors');
const queryBuilder = require('../functions/queryBuilder');

const Post = mongoose.model('School');
module.exports = {

    findBySchool: co.wrap(function*(schoolId, filter) {
        let query = Post.find({
            schoolId: schoolId
        });
        if (!_.isEmpty(filter)) {
            queryBuilder(query, filter);
        }
        return yield query.lean().exec();
    })
};
