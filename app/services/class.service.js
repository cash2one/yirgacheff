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
const Student = mongoose.model('Student');


module.exports = {

    create: co.wrap(function*(user, data) {
        let clazz = new Class(data);
        _.assign(clazz, {
            owner: user._id,
            ownerDisplayName: user.displayName,
            ownerUsername: user.username,
            schoolId: user.schoolId
        });
        return yield clazz.save();

    }),

    /**
     *  获取指定学校的班级数量
     */
    countBySchool: co.wrap(function* (schoolId) {
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
    countByTeacher: co.wrap(function*(teacherId) {
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
        _.defaultsDeep(filter, {where: {state: 0}});
        queryBuilder(query, filter);
        return query.lean().exec();
    }),


    /**
     * 根据学校ID查询班级列表
     */
    findByTeacher: co.wrap(function*(teacherId, filter) {
        let query = Class.find({
            owner: teacherId
        });
        if (_.isEmpty(filter)) {
            return query.where('state', 0).lean().exec();
        }
        _.defaultsDeep(filter, {where: {state: 0}});
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
    changeOwner: co.wrap(function*(data) {

        if (!data || !data.username || !data.classId) {
            throw createError(400, '参数不完整');
        }

        let teacher = yield Teacher
            .findOne({username: data.username})
            .select('_id state displayName username').exec();

        if (!teacher) {
            throw createError(400, '教师不存在');
        }
        if (teacher.isDisabled()) {
            throw createError(400, '教师已禁用');
        }
        yield Class.update({_id: data.classId}, {
            $set: {
                owner: teacher,
                ownerDisplayName: teacher.displayName,
                ownerUsername: teacher.username
            }
        }).exec();
        return true;
    }),


    updateById: co.wrap(function*(id, data) {
        let clazz = yield Class.findById(id).exec();
        if (!clazz) {
            throw createError(400, '班级不存在');
        }
        let newName = data.className && data.className.trim();
        if (clazz.className !== newName) {
            clazz.className = newName;
            yield clazz.save();
        }
        return clazz;
    }),


    deleteById: co.wrap(function*(id) {
        let clazz = yield Class.findById(id).exec();
        if (!clazz) {
            throw createError(400, '班级不存在');
        }
        let studentCount = yield Student.count({classes: clazz}).exec();
        if (studentCount > 0) {
            throw createError(400, '班级拥有学生,无法删除');
        }
        clazz.state = 1;
        yield clazz.remove();
        return clazz;

    }),

    deleteStudentById: co.wrap(function*(classId, studentId) {
        let student = yield Student.findById(studentId).exec();
        student.classes.pull(classId);
        return yield student.save();

    }),

    addStudent: co.wrap(function*(classId, data) {
        let username = data.username;
        if (!username) {
            throw createError(400, '缺少学生信息');
        }
        let clazz = yield Class.findById(classId).select('schoolId').lean().exec();
        if (!clazz) {
            throw createError(400, '班级不存在');
        }
        let student = yield Student.findOne({
            username: username,
            schoolId: clazz.schoolId,
            state: 0
        }).select('classes').exec();
        if (!student) {
            throw createError(400, '学生不存在');
        }
        if (student.classes.indexOf(clazz._id) !== -1) {
            throw createError(400, '学生已经在该班级');
        }
        student.classes.addToSet(clazz);
        return yield student.save();

    })
};