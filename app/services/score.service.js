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
    })

}
;
