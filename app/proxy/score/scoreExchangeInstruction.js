'use strict';
var mongoose = require('mongoose'),
    ScoreExchangeInstruction = mongoose.model('ScoreExchangeInstruction');

/**
 * 添加或者更新积分兑换说明
 * @param data
 * @param callback
 * @returns {*}
 */
exports.saveOrUpdate = function (data, callback) {
    if (!data) {
        return callback(new Error('未指定保存数据'));
    }
    if (!data.schoolId) {
        return callback(new Error('未指定学校ID'));
    }
    ScoreExchangeInstruction.findOneAndUpdate(
        {schoolId: data.schoolId},
        {$set: {content: data.content}},
        {upsert: true}, callback);
};


/**
 * 根据学校ID获取积分兑换说明
 * @param schoolId
 * @param callback
 * @returns {*}
 */
exports.findBySchool = function (schoolId, callback) {
    if (!schoolId) {
        return callback(new Error('未指定学校ID'));
    }
    ScoreExchangeInstruction.findOne({schoolId: schoolId}, callback);
};


exports.Model = ScoreExchangeInstruction;