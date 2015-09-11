/**
 *
 * Created by Frank on 15/5/15.
 */
'use strict';
var swig = require('swig');


swig.setFilter('subTitle', function (input, length) {
    if (input && input.length > length) {
        return input.substring(0, length) + '...';
    }
    return input;
});

swig.setFilter('caculateTime', function (input, flag) {
    if (flag === 'hour') {
        return parseInt(input / 60 / 60);
    } else if (flag === 'minute') {
        return parseInt(input / 60 % 60);
    } else if (flag === 'second') {
        return parseInt(input % 60);
    }
    return input;
});

module.exports = swig;
