'use strict';
var requireDir = require('require-dir'),
    _ = require('lodash'),
    core = require('../controllers/core.controller');


module.exports = function (app) {

    // 首页
    app.get('/', core.index);

    // 登陆
    app.route('/login')
        .get(core.showLogin)
        .post(core.login);

    // 登出
    app.get('/logout', core.logout);

    // 加载web目录下的每一个web路由
    _.forEach(requireDir('./web'), function (router) {
        router(app);
    });
    console.log('web routes finished loading');

};