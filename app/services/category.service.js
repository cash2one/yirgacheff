/**
 * Created by Frank on 15/12/21.
 */
'use strict';
const mongoose = require('mongoose');
const co = require('co');
const _ = require('lodash');
const Category = mongoose.model('Category');
const createError = require('http-errors');

module.exports = {

    findBySchool: co.wrap(function*(schoolId) {
        return yield Category.find({
            schoolId: schoolId
        }).lean().exec();
    }),

    findById: co.wrap(function*(id, isLean) {
        let query = yield Category.findById(id);
        if (isLean === true) {
            query.lean();
        }
        return query.exec();
    }),

    deleteById: co.wrap(function*(id) {
        let category = yield Category.findById(id).exec();
        if (!category) {
            throw createError(400, '分组不存在');
        }
        if (category.postCount > 0) {
            throw createError(400, '分组还有文章存在,无法删除');
        }
        return yield category.remove();
    }),

    updateById: co.wrap(function*(id, data) {
        let category = yield Category.findById(id).exec();
        if (!category) {
            throw createError(400, '分组不存在');
        }
        _.assign(category, data);

        return yield category.save();
    }),


    create: co.wrap(function*(schoolId, data) {
        let category = new Category(data);
        category.schoolId = schoolId;
        return yield category.save();
    })

};