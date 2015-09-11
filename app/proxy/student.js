/**
 * Created by Frank on 15/4/12.
 */
'use strict';

var mongoose = require('mongoose'),
    _ = require('lodash'),
    async = require('async'),
    operations = require('../common/constants').operations,
    roles = require('../common/constants').roles,
    queryUtils = require('./queryUtils'),
    redisClient = require('../../db/redis'),
    Class = mongoose.model('Class'),
    Student = mongoose.model('Student'),
    Counter = mongoose.model('Counter');

function makeKey(id) {
    return 'students:' + id;
}


/**
 * 新建学生
 * @param data
 * @param callback
 */
exports.save = function (data, callback) {
    if (!data) {
        return callback(new Error('未指定保存数据'));
    }
    if (!data.schoolId) {
        return callback(new Error('未指定学校ID'));
    }
    if (!data.schoolNum) {
        return callback(new Error('未指定学校编号'))
    }
    Counter.generateSequence('student', data.schoolId,
        function (err, counter) {
            if (err) {
                return callback(err);
            }
            var student = new Student(data);
            var seq = counter ? counter.seq : 0;
            student.username = data.schoolNum + roles.STUDENT + seq;
            student.save(callback);
        });
};

/**
 *
 * 修改学生信息
 * @param id
 * @param data
 * @param callback
 *
 */
exports.updateById = function (id, data, callback) {
    if (!id) {
        return callback(new Error('学生ID不能为空'));
    }
    if (!data) {
        return callback(new Error('修改信息不能为空'));
    }
    Student.findByIdAndUpdate(id, data, {new: true}, function (err, student) {
        if (err) {
            callback(err);
        } else {
            redisClient.del(makeKey(id), function (err) {
                if (err) {
                    console.error(err);
                }
            });
            callback(null, student);
        }
    });
};


/**
 * 查询指定教师的学生列表
 * @param teacherId
 * @param callback
 */
exports.findByTeacherId = function (teacherId, callback) {
    if (!teacherId) {
        return callback(new Error('教师未指定'));
    }
    Class.find({owner: teacherId, state: 0}, '_id', function (err, classes) {
        if (err) {
            return callback(err);
        }
        Student.find({classes: {$in: classes}},
            'username displayName password gender onSchool',
            function (err, students) {
                if (err) {
                    return callback(err);
                }
                callback(null, students);
            })
    });
};

/**
 *
 * 根据查询条件返回学生列表
 * @param conditions 查询条件
 * @param callback
 * @returns {*}
 *
 */
exports.find = function (conditions, callback) {
    if (!conditions) {
        return callback(new Error('未指定查询条件'));
    }
    var query = queryUtils.makeQuery(Student.find({}), conditions);
    query.exec(callback);
};


/**
 * 根据ID查询学生
 * @param id
 * @param callback
 */
exports.findById = function (id, callback) {
    if (!id) {
        return callback(new Error('学生ID未指定'));
    }
    var key = makeKey(id);
    redisClient.hgetall(key, function (err, cachedStudent) {
        if (err || !cachedStudent) {
            Student.findById(id)
                .lean()
                .select('-createdTime -__v -password -state -classes')
                .exec(function (err, student) {
                    if (err || !student) {
                        return callback(err || new Error('学生不存在'));
                    }
                    redisClient.hmset(key, student, function (err) {
                        if (err) {
                            console.error(err);
                        }
                    });
                    callback(null, student);
                });
        } else {
            callback(null, cachedStudent);
        }
    });
};

/**
 * 根据学号查询学生
 * @param username
 * @param conditions
 * @param callback
 * @returns {*}
 */
exports.findByUsername = function (username, conditions, callback) {
    if (!username) {
        return callback(new Error('学号未指定'), null);
    }
    var query = queryUtils.makeQuery(Student.findOne({username: username}), conditions);
    query.exec(callback);
};


/**
 * 查询指定教师的学生数量
 * @param teacherId
 * @param callback
 */
exports.countByTeacherId = function (teacherId, callback) {
    if (!teacherId) {
        return callback(new Error('教师未指定'));
    }
    Class.find({owner: teacherId, state: 0}, 'students',
        function (err, classes) {
            if (err) {
                return callback(err);
            }
            //如果该教师没有班级，返回空列表
            if (_.isEmpty(classes)) {
                return callback(null, 0);
            }
            callback(null, _.sum(classes, function (clazz) {
                return clazz.students ? clazz.students.length : 0;
            }));
        });
};


// 获取没有班级的学生列表
exports.getStudentsOfNoneClass = function (schoolId, callback) {
    if (!schoolId) {
        return callback(new Error('未指定学校ID'));
    }
    Student.where('state', 0)
        .where('classes').size(0)
        .lean()
        .exec(callback);
};

/**
 * 对指定学生进行积分操作
 * @param studentId 学生ID
 * @param operation
 * @param value
 * @param callback
 */
exports.scoreOperate = function (studentId, operation, value, callback) {
    operation = parseInt(operation);
    if (operation !== operations.INCREASE && operation !== operations.DECREASE) {
        return callback(new Error('未定义积分操作'));
    }
    var score = parseInt(value);
    if (_.isNaN(score)) {
        return callback(new Error('积分必须为数字'));
    }
    score = operation === operations.INCREASE ? value : 0 - value;
    Student.findById(studentId, 'score', function (err, student) {
        if (err || !student) {
            return callback(err || new Error('进行积分操作的学生不存在'));
        }
        var currentScore = student.score;
        if (value + currentScore < 0) {
            value = 0 - currentScore;
        }
        Student.update({_id: studentId}, {$inc: {score: value}}, function (err) {
            if (err) {
                return callback(err);
            }
            redisClient.del(makeKey(studentId), function (err) {
                if (err) {
                    console.error(err);
                }
            });
            callback(null, score + currentScore);
        });
    });
};


/**
 * 获取一个学校积分前十名的学生
 * @param schoolId
 * @param callback
 */
exports.scoreTopTen = function (schoolId, callback) {
    Student.find({schoolId: schoolId, state: 0})
        .sort('-score')
        .limit(10)
        .lean()
        .select('displayName username score avatar')
        .exec(callback);
};

/**
 * 获取一个学生的积分排名
 * @param student
 * @param callback
 */
exports.scoreRank = function (student, callback) {
    Student.find({
        schoolId: student.schoolId, state: 0,
        score: {$gt: student.score}
    }).count(function (err, count) {
        callback(err, count + 1);
    })
};
exports.deleteCacheById = function (id, callback) {
    redisClient.del(makeKey(id), callback);
};

exports.Model = Student;
