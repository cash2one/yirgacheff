/**
 * Created by Frank on 15/12/18.
 */

'use strict';
const mongoose = require('mongoose');
const co = require('co');
const _ = require('lodash');
const createError = require('http-errors');
const queryBuilder = require('../functions/queryBuilder');
const ScoreExchangeInstruction = mongoose.model('ScoreExchangeInstruction');
const ScoreExchange = mongoose.model('ScoreExchange');
const ScoreLog = mongoose.model('ScoreLog');
const Student = mongoose.model('Student');

module.exports = {

    /**
     * 获取兑换规则
     */
    getInstruction: co.wrap(function*(schoolId) {
        return yield ScoreExchangeInstruction.findOne({schoolId: schoolId});
    }),


    /**
     * 添加或修改兑换规则
     */
    addOrUpdateInstruction: co.wrap(function*(schoolId, data) {
        return yield ScoreExchangeInstruction.findOneAndUpdate({
            schoolId: schoolId
        }, {
            $set: {content: data, schoolId: schoolId}
        }, {upsert: true}).exec();
    }),

    /**
     * 获取兑换商品
     */
    getExchanges: co.wrap(function*(schoolId, filter) {
        let query = ScoreExchange.find({
            schoolId: schoolId
        });
        if (_.isEmpty(filter)) {
            return yield query.lean().exec();
        }
        queryBuilder(query, filter);
        return yield query.lean().exec();
    }),

    /**
     * 添加兑换商品
     */
    addExchange: co.wrap(function*(schoolId, data) {
        data.schoolId = schoolId;
        let exchange = new ScoreExchange(data);
        return yield exchange.save();
    }),

    /**
     * 修改兑换商品
     */
    updateExchangeById: co.wrap(function*(id, data) {
        let exchange = yield ScoreExchange.findById(id).exec();
        if (!exchange) {
            throw createError(400, '商品不存在');
        }
        _.assign(exchange, data);
        return yield exchange.save();
    }),


    /**
     * 删除兑换商品
     */
    deleteExchangeById: co.wrap(function*(id) {
        let exchange = yield ScoreExchange.findById(id).exec();
        if (!exchange) {
            throw createError(400, '商品不存在');
        }
        return yield exchange.remove();
    }),

    /**
     * 积分操作
     */
    scoreAward: co.wrap(function*(studentIds, data, operator) {
        console.log(data);
        if (!_.isArray(studentIds)) {
            studentIds = [studentIds];
        }
        let remark = data.remark;
        let opt = parseInt(data.operation);
        let value = parseInt(data.score);
        if (_.isNaN(opt) || _.isNaN(value)) {
            throw createError(400, '非法参数');
        }
        value = opt === 0 ? value : (0 - value);
        yield Student.where('_id').in(studentIds).update({}, {
            $inc: {score: value}
        }, {multi: true}).exec();

        let logs = _.map(studentIds, student=> {
            return {
                student: student,
                operator: operator._id,
                value: data.score,
                operation: opt,
                remark: remark,
                schoolId: operator.schoolId
            }
        });
        yield ScoreLog.create(logs);
        return true;
    }),

    /**
     * 获取积分日志
     */
    logByStudent: co.wrap(function*(studentId) {
        this.body = yield ScoreLog.find({
            student: studentId
        }).populate('operator', 'displayName').lean().exec();

    })

};
