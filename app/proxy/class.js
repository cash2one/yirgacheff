/**
 * Created by Frank on 15/4/12.
 */
'use strict';

var mongoose = require('mongoose'),
    _ = require('lodash'),
    async = require('async'),
    queryUtils = require('./queryUtils'),
    redisClient = require('../../db/redis'),
    Homework = mongoose.model('Homework'),
    Student = mongoose.model('Student'),
    Class = mongoose.model('Class');

/**
 * 新建一个班级
 * @param data
 * @param callback
 * @returns {*}
 *
 */
exports.save = function (data, callback) {
    if (!data) {
        return callback(new Error('未指定保存数据'));
    }
    if (!data.schoolId) {
        return callback(new Error('未指定学校ID'));
    }
    if (!data.owner) {
        return callback(new Error('班级拥有者未指定'), null);
    }
    var clazz = new Class(data);
    clazz.save(callback);
};


/**
 * 根据查询条件返回结果集
 * @param conditions
 * @param callback
 */
exports.find = function (conditions, callback) {
    if (!conditions) {
        return callback(new Error('未指定查询条件'));
    }
    var query = queryUtils.makeQuery(Class.find({}), conditions);
    query.exec(callback);
};

/**
 * 添加学生到指定班级
 * @param classId
 * @param student
 * @param callback
 */
exports.addStudent = function (classId, student, callback) {
    if (student.state === 1) {
        return callback(new Error('该学生已经被删除'));
    }
    async.parallel([
        function (callback) {
            Class.update({_id: classId}, {$addToSet: {students: student}}, callback);
        }, function (callback) {
            Student.update({_id: student._id}, {$addToSet: {classes: classId}}, callback);
        }
    ], callback);
};


/**
 * 删除学生
 * @param classId
 * @param student
 * @param callback
 */
exports.deleteStudent = function (classId, student, callback) {
 
};

/**
 * 获取指定班级的学生
 * @param classId
 * @param callback
 */
exports.getStudentsByClassId = function (classId, callback) {
    Class.findById(classId).populate('students').exec(function (err, clazz) {
        if (err || !clazz) {
            return callback(err || new Error('指定班级不存在'));
        }
        return callback(null, clazz.students);
    });
};


/**
 * 根据查询条件返回结果集
 * @param id
 * @param conditions
 * @param callback
 */
exports.findById = function (id, conditions, callback) {
    if (!id) {
        return callback(new Error('未指定班级ID'));
    }
    var query = queryUtils.makeQuery(Class.findById(id), conditions);
    query.exec(callback);
};


/**
 * 修改班级
 * @param id
 * @param data
 * @param callback
 * @returns {*}
 */
exports.updateById = function (id, data, callback) {
    if (!id) {
        return callback(new Error('修改班级ID未指定'));
    }
    if (!data) {
        return callback(new Error('没有需要修改的信息'));
    }
    Class.findByIdAndUpdate(id, data, callback);
};

/**
 * 根据查询条件返回班级数量
 * @param conditions
 * @param callback
 */
exports.count = function (conditions, callback) {
    Class.count(conditions).exec(callback);
};


/**
 * 返回指定班级的学生数量
 * @param id
 * @param callback
 */
exports.studentCount = function (id, callback) {
    if (!id) {
        return callback(new Error('未指定班级ID'));
    }
    Student.count({classes: {$in: [id]}}, callback);
};

exports.Model = Class;



