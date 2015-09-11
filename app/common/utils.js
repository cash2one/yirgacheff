'use strict';
var _ = require('lodash'),
    crypto = require('crypto');


function getUniqueErrorMessage(err) {
    var output;

    try {
        var fieldName = err.err.substring(err.err.lastIndexOf('.$') + 2, err.err.lastIndexOf('_1'));
        output = fieldName.charAt(0).toUpperCase() + fieldName.slice(1) + ' 已经存在';

    } catch (ex) {
        output = 'Unique field already exists';
    }

    return output;
}

/**
 * Get the error message from error object
 */
function getErrorMessage(err) {
    var message = '';
    if (err.code) {
        switch (err.code) {
            case 11000:
            case 11001:
                message = getUniqueErrorMessage(err);
                break;
            default:
                message = 'Something went wrong';
        }
    } else {
        for (var errName in err.errors) {
            if (err.errors[errName].message) {
                message = err.errors[errName].message;
            }

        }
    }
    return message;
}

/**
 * 请求错误
 * @param res
 * @param err
 * @returns {*}
 */
exports.error_400 = function (res, err) {
    if (typeof err === 'string') {
        err = new Error(err);
    }
    if (err) {
        console.error(err.message);
    }
    return res.json({
        code: 400,
        message: err && err.message
    });
};

/**
 * 权限错误
 * @param res
 * @returns {*}
 */
exports.error_401 = function (res) {
    return res.json({code: 401, message: '没有登录'});
};

/**
 * 权限错误
 * @param res
 * @returns {*}
 */
exports.error_403 = function (res) {
    return res.json({code: 401, message: '权限错误'});
};

/**
 * 系统错误
 * @param res
 * @param err
 * @returns {*}
 */
exports.error_500 = function (res, err) {
    if (typeof err === 'string') {
        err = new Error(err);
    }

    if (err) {
        console.error(err);
    }
    return res.json({
        code: 500,
        message: err && err.message
    });
};

/**
 * 成功响应
 * @param res
 * @param data
 * @returns {*}
 */
exports.success = function (res, data) {
    return res.json(data);
    //return res.json({
    //    code: 200,
    //    data: data
    //});
};


exports.toBase64 = function (source) {
    var buffer = new Buffer(source);
    return buffer.toString('base64');
};

exports.fromBase64 = function (source) {
    var buffer = new Buffer(source, 'base64');
    return buffer.toString();
};


exports.validateExist = function (sourceObject, fields) {
    sourceObject = sourceObject || {};
    fields = fields || [];
    return _.every(_.map(fields, function (field) {
        _.contains(sourceObject, field);
    }));

};

exports.hashPassword = function (password) {
    var md5 = crypto.createHash('md5');
    md5.update(password);
    return md5.digest('hex');  //MD5值是5f4dcc3b5aa765d61d8327deb882cf99
};
