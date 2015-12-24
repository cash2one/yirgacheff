/**
 * Created by Frank on 15/12/18.
 */
'use strict';


const mongoose = require('mongoose');
const co = require('co');
const _ = require('lodash');
const math = require('mathjs');
const createError = require('http-errors');
const roles = require('../common/constants').roles;
const queryBuilder = require('../functions/queryBuilder');
const Teacher = mongoose.model('Teacher');
const Class = mongoose.model('Class');
const Quiz = mongoose.model('Quiz');
const Counter = mongoose.model('Counter');
const School = mongoose.model('School');
const ObjectId = mongoose.Types.ObjectId;

module.exports = {


    /**
     * 创建教师
     *
     */
    create: co.wrap(function*(schoolId, data) {
        let school = yield School.findById(schoolId).select('username').exec();
        if (!school) {
            throw createError(400, '学校不存在');
        }
        let counter = yield Counter.generateSequence('teacher', schoolId);
        let teacher = new Teacher(data);
        teacher.username = school.username + roles.TEACHER + counter.seq;
        teacher.schoolId = school;
        yield teacher.save();
        return teacher;
    }),


    /**
     * 根据id修改教师
     */
    updateById: co.wrap(function*(id, data) {
        let teacher = yield Teacher.findById(id).exec();
        if (!teacher) {
            throw createError(400, '教师不存在');
        }
        if (_.isEmpty(data)) {
            throw createError(400, '没有更新数据');
        }

        let isNameChange = data.displayName && teacher.displayName !== data.displayName;
        _.extend(teacher, data);
        yield teacher.save();
        if (isNameChange) {
            yield [
                Class.update({owner: teacher}, {ownerDisplayName: teacher.displayName}, {multi: true}).exec(),
                Quiz.update({creator: teacher}, {creatorDisplayName: teacher.displayName}, {multi: true}).exec()
            ]
        }
        return teacher;
    }),


    /**
     * 根据学校id查询教师信息
     */
    findBySchool: co.wrap(function*(schoolId, filter) {
        let query = Teacher.find({schoolId: schoolId});
        if (_.isEmpty(filter)) {
            return query.where('state', 0).exec();
        }
        //如果没有设置状态位,默认设置位0
        _.defaultsDeep(filter, {where: {state: 0}});
        query = queryBuilder(query, filter);
        return yield query.exec();
    }),


    /**
     * 根据id删除教师 (假删除,只改变状态位)
     */
    deleteById: co.wrap(function*(id) {
        let classCount = yield Class.count({owner: id}).exec();
        if (classCount > 0) {
            throw createError(400, '该教师还有班级，不能禁用');
        }
        let teacher = yield Teacher.findById(id).exec();
        if (!teacher || teacher.isDisabled()) {
            throw createError(400, '教师不存在或已删除');
        }
        teacher.setDisabled();
        yield teacher.save();
        return true;
    }),


    /**
     *  获取指定学校的教师数量
     */
    countBySchool: co.wrap(function* (schoolId, filter) {
        let query = Teacher.where('schoolId', schoolId);
        if (_.isEmpty(filter)) {
            return yield query.where('state', 0).count();
        }
        _.defaultsDeep(filter, {where: {state: 0}}); //如果没有设置状态位,默认设置位0
        queryBuilder(query, filter);
        return yield query.count();
    }),


    /**
     * 根据班级数量获取教师排名
     */
    getTopOfOwnClass: co.wrap(function*(schoolId) {
        let teachers = yield Class.aggregate()
            .match({
                schoolId: new ObjectId(schoolId),
                state: 0
            })
            .project({
                owner: 1,
                _id: 0,
                ownerDisplayName: 1
            })
            .group({
                _id: '$owner',
                classesCount: {$sum: 1},
                displayName: {$first: '$ownerDisplayName'}
            })
            .sort({
                classesCount: -1
            }).exec();

        let totalCountOfClass = _.sum(teachers, teacher=> {
            return teacher.classesCount;
        });
        let topTenTeachers = _.take(teachers, 10);
        let topTenCount = 0;
        let series = [];
        if (totalCountOfClass > 0) {
            _.forEach(topTenTeachers, teacher=> {
                teacher.classesCountPercent = math.round((teacher.classesCount / totalCountOfClass), 3);
                series.push([teacher.displayName, teacher.classesCount]);
                topTenCount += teacher.classesCount;
            });
            series.push(['其他', totalCountOfClass - topTenCount]);
        }
        return {
            teachers: topTenTeachers,
            series: series
        };
    }),

    /**
     *
     * 根据题库数量获取教师排名
     *
     */
    getTopOfQuiz: co.wrap(function*(schoolId) {
        let quizCount = yield Quiz.count({schoolId: schoolId}).exec();
        let teachers = yield Quiz.aggregate()
            .match({
                schoolId: new ObjectId(schoolId)
            })
            .project({
                _id: 0,
                creator: 1,
                creatorDisplayName: 1
            })
            .group({
                _id: '$creator',
                quizzesCount: {$sum: 1},
                displayName: {$first: '$creatorDisplayName'}
            })
            .sort({
                quizzesCount: -1
            })
            .limit(10)
            .exec();

        if (quizCount > 0) {
            _.forEach(teachers, teacher=> {
                teacher.quizzesPercent = math.round(teacher.quizzesCount / quizCount, 3);
            });
        }
        return teachers;
    })

};