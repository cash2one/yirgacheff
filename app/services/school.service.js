/**
 * Created by Frank on 15/12/28.
 */
'use strict';

const co = require('co');
const _ = require('lodash');
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
        let school = yield School.findById(schoolId).exec();
        _.assign(school, _.omit(data, 'password', 'salt'));
        return yield school.save();
    })

};