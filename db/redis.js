'use strict';
/**
 * Module dependencies.
 */

const Redis = require('ioredis');
const config = require('../config/config').redis;


const redis = new Redis({

    port: config.port,

    host: config.host,

    keyPrefix: config.prefix,

    retryStrategy(times) {
        return Math.min(times * 2, 2000);
    }

});


module.exports = redis;
