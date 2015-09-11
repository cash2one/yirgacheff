/**
 * Created by Frank on 15/4/13.
 */

'use strict';

var scores = require('../../api/v1/scores.api');

module.exports = function (api) {

    // 积分相关API
    api.get('/scores/scoreExchanges', scores.findScoreExchange); // 列出积分兑换商品
    api.post('/scores/scoreExchanges', scores.addScoreExchange); // 添加积分兑换商品
    api.delete('/scores/scoreExchanges/:scoreExchangeId', scores.deleteScoreExchange); // 删除积分兑换商品
    api.post('/scores/scoreExchangeInstructions', scores.addScoreExchangeInstruction); // 添加积分说明

};

