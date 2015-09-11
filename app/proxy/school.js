/**
 * Created by Frank on 15/4/12.
 */
'use strict';

var mongoose = require('mongoose'),
    School = mongoose.model('School'),
    redisClient = require('../../db/redis');
function makeKey(id) {
    return 'schools:' + id;
}

exports.findById = function (id, callback) {
    if (!id) {
        return callback(new Error('学校ID未指定'));
    }
    var key = makeKey(id);
    redisClient.hgetall(key, function (err, cachedSchool) {
        if (err || !cachedSchool) {
            School.findById(id)
                .lean()
                .select('-createdTime -__v -password -salt -state')
                .exec(function (err, school) {
                    if (err || !school) {
                        return callback(err || new Error('学校不存在'));
                    }
                    school.schoolId = id;
                    redisClient.hmset(key, school, function (err) {
                        if (err) {
                            console.error(err);
                        }
                    });
                    callback(null, school);
                });
        } else {
            callback(null, cachedSchool);
        }
    });
};


/**
 * 修改学校信息
 * @param id
 * @param data
 * @param callback
 */
exports.updateById = function (id, data, callback) {
    if (!id) {
        return callback(new Error('学校ID不能为空'));
    }
    if (!data) {
        return callback(new Error('没有需要修改的信息'));
    }
    School.findByIdAndUpdate(id, data, {new: true},
        function (err, school) {
            if (err) {
                callback(err);
            } else {
                redisClient.del(makeKey(id), function (err) {
                    if (err) {
                        console.error(err);
                    }
                });
                callback(null, school);
            }
        });
};

exports.deleteCacheById = function (id, callback) {
    redisClient.del(makeKey(id), callback);
};

exports.Model = School;
