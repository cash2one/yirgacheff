/**
 * Created by Frank on 16/1/20.
 */
'use strict';

const _ = require('lodash');
const co = require('co');
const mongoose = require('mongoose');
const EnrollNames = mongoose.model('EnrollNames');

module.exports = {

    getEnrollNames: co.wrap(function*(enroll) {
        return yield EnrollNames.find({
            enroll: enroll
        }).exec();
    }),

    getEnrollCount: co.wrap(function*(enroll) {
        return yield EnrollNames.count({enroll: enroll}).exec();

    })

};