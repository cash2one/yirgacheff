/**
 *
 * Created by Frank on 15/4/12.
 */

'use strict';
var mongoose = require('mongoose'),
    queryUtils = require('./queryUtils'),
    CommunicationRecord = mongoose.model('CommunicationRecord');

/**
 * 创建新的电话纪录
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
    var record = new CommunicationRecord(data);
    record.save(callback);

};

exports.find = function (conditions, callback) {
    if (!conditions) {
        return callback(new Error('查询条件不能为空'));
    }
    var query = queryUtils.makeQuery(CommunicationRecord.find({}), conditions);
    query.exec(callback);
};

exports.Model = CommunicationRecord;