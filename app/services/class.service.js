/**
 * Created by Frank on 15/12/18.
 */

'use strict';
const mongoose = require('mongoose');
const _ = require('lodash');
const co = require('co');
const createError = require('http-errors');
const queryBuilder = require('../functions/queryBuilder');
const Class = mongoose.model('Class');
const Teacher = mongoose.model('Teacher');


module.exports = {

    /**
     *  获取指定学校的班级数量
     */
    getCountBySchool: co.wrap(function* (schoolId) {
        return yield Class.count({
            schoolId: schoolId,
            state: 0
        }).exec();

    }),

    /**
     *
     * 获取指定教师的班级数量
     *
     */
    getCountByTeacher: co.wrap(function*(teacherId) {
        return yield Class.count({
            owner: teacherId
        });
    }),


    /**
     * 根据学校ID查询班级列表
     */
    findBySchool: co.wrap(function*(schoolId, filter) {
        let query = Class.find({
            schoolId: schoolId
        });
        if (_.isEmpty(filter)) {
            return query.where('state', 0).lean().exec();
        }
        queryBuilder(query, filter);
        return query.lean().exec();
    }),

    /**
     * 根据ID获取班级信息
     */
    findById: co.wrap(function*(id) {
        return yield  Class.findById(id).exec();
    }),

    /**
     * 更换班级拥有者
     */
    changeOwner: co.wrap(function*(classId, owner) {

        let teacher = yield Teacher
            .findOne({username: owner})
            .select('_id state displayName username').exec();

        if (!teacher) {
            throw createError(400, '教师不存在');
        }
        if (teacher.isDisabled()) {
            throw createError(400, '教师已禁用');
        }
        yield Class.update({_id: classId}, {
            $set: {
                owner: teacher,
                ownerDisplayName: teacher.displayName,
                ownerUsername: teacher.username
            }
        }).exec();
        return true;
    })
};