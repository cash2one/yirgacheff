/**
 * Created by Frank on 15/12/21.
 */
'use strict';
const mongoose = require('mongoose');
const co = require('co');
const Category = mongoose.model('Category');

module.exports = {
    findBySchool: co.wrap(function*(schoolId) {
        return yield Category.find({
            schoolId: schoolId
        }).lean().exec();
    })
};