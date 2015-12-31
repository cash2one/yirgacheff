/**
 * Created by Frank on 15/12/28.
 */
'use strict';

const co = require('co');
const _ = require('lodash');
const createError = require('http-errors');
const mongoose = require('mongoose');
const Counter = mongoose.model('Counter');
const School = mongoose.model('School');


module.exports = {

    create: co.wrap(function*(data) {
        let counter = yield Counter.generateSequence('headmaster');
        let school = new School(data);
        school.username = counter.seq + 10000;
        school.password = '12345678';
        return yield school;
    }),

    findAll: co.wrap(function*() {
        return yield School.find({}).exec();
    }),


    updateById: co.wrap(function*(schoolId, data) {
        let updatedData = _.omit(data, 'password', 'salt', '_');
        let school = yield School.findByIdAndUpdate(schoolId, updatedData).exec();
        if (!school) {
            throw createError(400, '学校不存在');
        }
        return school;
    })

};