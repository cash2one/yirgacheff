'use strict';
var mongoose = require('mongoose'),
    ScoreTrace = mongoose.model('ScoreTrace');

exports.save = function (data, callback) {
    if (!data) {
        return callback(new Error('未指定保存数据'));
    }
    if (!data.schoolId) {
        return callback(new Error('未指定学校ID'));
    }
    var scoreTrace = new ScoreTrace(data);
    scoreTrace.save(callback);
};


exports.Model = ScoreTrace;