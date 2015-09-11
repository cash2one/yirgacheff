/**
 * Created by Frank on 15/4/13.
 *
 * 家校通相关API
 *
 */

'use strict';

var communication = require('../../api/v1/communication.api');

module.exports = function (api) {
    //添加一条家校通纪录
    api.post('/connections/students/:studentId([a-f0-9]{24})', communication.create);
};