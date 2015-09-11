'use strict';
var later = require('later'),
    mongoose = require('mongoose'),
    states = require('../common/constants').states,
    _ = require('lodash'),
    Uploads = mongoose.model('Uploads');

module.exports = function () {


    // 定时,每天凌晨1点检查过期的文件，并将过期文件放入任务队列中
    (function () {

    })();
};



