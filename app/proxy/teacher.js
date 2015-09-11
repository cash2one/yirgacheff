/**
 * Created by Frank on 15/4/12.
 */
'use strict';

var mongoose = require('mongoose'),
    _ = require('lodash'),
    format = require("string-template"),
    queryUtils = require('./queryUtils'),
    roles = require('../common/constants').roles,
    redisClient = require('../../db/redis'),
    Teacher = mongoose.model('Teacher'),
    Counter = mongoose.model('Counter'),
    Class = mongoose.model('Class'),
    Quiz = mongoose.model('Quiz');

function makeKey(id) {
    return 'teachers:' + id;
}

/**
 * 新建教师
 * @param data
 * @param callback
 */
exports.save = function (data, callback) {
    if (!data) {
        return callback(new Error('教师数据为空'));
    }
    if (!data.schoolId) {
        return callback(new Error('学校ID未指定'));
    }
    if (!data.schoolNum) {
        return callback(new Error('学校编号未指定'))
    }
    Counter.generateSequence('teacher', data.schoolId, function (err, counter) {
        if (err) {
            return callback(err);
        }
        var teacher = new Teacher(data);
        var seq = counter ? counter.seq : 0;
        teacher.username = data.schoolNum + roles.TEACHER + seq;
        teacher.save(callback);
    });
};
/**
 * 修改教师信息
 * @param id
 * @param data
 * @param callback
 */
exports.updateById = function (id, data, callback) {
    if (!id) {
        return callback(new Error('教师ID不能为空'));
    }
    if (!data) {
        return callback(new Error('没有需要修改的信息'));
    }
    Teacher.findByIdAndUpdate(id, data, {new: true}, function (err, teacher) {
        if (err) {
            callback(err);
        } else {
            redisClient.del(makeKey(id), function (err) {
                if (err) {
                    console.error(err);
                }
            });
            callback(null, teacher);
        }
    });
};

/**
 * 根据ID查询教师
 * @param id
 * @param callback
 */
exports.findById = function (id, callback) {
    if (!id) {
        return callback(new Error('学校ID或教师ID未指定'));
    }
    var key = makeKey(id);
    redisClient.hgetall(key, function (err, cachedTeacher) {
        if (err || !cachedTeacher) {
            Teacher.findById(id)
                .select('-createdTime -__v -password -state')
                .lean()
                .exec(function (err, teacher) {
                    if (err || !teacher) {
                        return callback(err || new Error('教师不存在'));
                    }
                    redisClient.hmset(key, teacher, function (err) {
                        if (err) {
                            console.error(err);
                        }
                    });
                    callback(null, teacher);
                });
        } else {
            callback(null, cachedTeacher);
        }
    });
};

/**
 * 根据查询条件返回教师数量
 * @param conditions
 * @param callback
 */
exports.count = function (conditions, callback) {
    var query = queryUtils.makeQuery(Teacher.find({}), conditions);
    query.count(callback);
};
exports.deleteCacheById = function (id, callback) {
    redisClient.del(makeKey(id), callback);
};
exports.Model = Teacher;

