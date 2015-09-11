'use strict';
var mongoose = require('mongoose'),
    queryUtils = require('../queryUtils'),
    ScoreExchange = mongoose.model('ScoreExchange');

/**
 * @param data
 * @param callback
 * @returns {*}
 */
exports.save = function (data, callback) {
    console.log('data', data);
    if (!data) {
        return callback(new Error('未指定保存数据'));
    }
    if (!data.schoolId) {
        return callback(new Error('未指定学校ID'));
    }
    var scoreExchange = new ScoreExchange(data);
    scoreExchange.save(data, callback);
};

/**
 * 根据查询条件查询
 * @param conditions
 * @param callback
 * @returns {*}
 */
exports.find = function (conditions, callback) {
    if (!conditions) {
        return callback(new Error('未指定查询条件'));
    }
    var query = queryUtils.makeQuery(ScoreExchange.find({}), conditions);
    query.exec(callback);
};

exports.Model = ScoreExchange;