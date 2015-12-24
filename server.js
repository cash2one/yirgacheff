'use strict';
/**
 * Module dependencies.
 */

require('./config/init')();
require('./db/mongo');
var redis = require('./db/redis');
var config = require('./config/config');

// 初始化express 应用
//var express = require('./config/express');
//var app = express.init(redis);
// Start the app by listening on <port>
const app = require('./config/koa');
app.listen(config.port);
// Expose app
exports = module.exports = app;

// Logging initialization
console.log('application started on port ' + config.port);
