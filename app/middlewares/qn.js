/**
 * Created by Frank on 15/7/22.
 */
var qn = require('../common/qiniu');
var config = require('../../config/config');

/**
 * 上传录音的token
 * @param req
 * @param res
 * @param next
 */
exports.audioToken = function (req, res, next) {
    var policy = {
        fsizeLimit: 1024 * 1024 * 5,  //最多5M
        saveKey: '$(x:schoolId)/$(etag)$(ext)'
    };
    req.token = qn.generateToken(policy);
    next();
};


/**
 * 用于上通用传图片的token
 * @param req
 * @param res
 * @param next
 */
exports.imageToken = function (req, res, next) {
    var policy = {
        fsizeLimit: 1024 * 1024 * 2,  //2M
        mimeLimit: 'image/*',
        saveKey: '$(x:schoolId)/$(etag)$(ext)'
    };
    var resultToken = qn.generateToken(policy);
    res.locals.imageToken = resultToken;
    req.token = resultToken;
    next();
};


