'use strict';
var express = require('express'),
    requireDir = require('require-dir'),
    _ = require('lodash'),
    auth = require('../middlewares/api.auth');


module.exports = function (app) {
    var api = express.Router();

    // 对所有api进行登录验证
    api.all('*', auth.requiresLogin);

    // 加载api目录下的每一个api 路由
    _.forEach(requireDir('./api'), function (router) {
        router(api);
    });

    app.use('/api/v1', api);
    console.log('api routes finished loading');

};
