'use strict';
/**
 * Module dependencies.
 */
var config = require('../config/config');
var redis = require('redis');
var reconnect = 0;

function connect() {
    return redis.createClient(config.redis.port, config.redis.host, config.redis.options);
}
// 连接redis 用作session共享
var redisClient = connect();


redisClient.on('connect', function () {
    console.log('redis connect successfully');
});

redisClient.on('error', function (err) {
    console.log('reconnect : ', reconnect++);
    console.error(err);
});

module.exports = redisClient;
