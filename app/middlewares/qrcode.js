/**
 * Created by Frank on 15/7/15.
 */

var redis = require('../../db/redis');
var qrMaker = require('qr-image');
var request = require('request');
var mongoose = require('mongoose');
var School = mongoose.model('School');
var apiUrl = require('../../config/config').apiUrl;

/**
 * 获取二维码
 * @param req
 * @param res
 * @param next
 */
exports.getQrcode = function (req, res, next) {
    var schoolId = req.user.schoolId,
        key = 'qrcode:' + schoolId;
    redis.get(key, function (err, qrcode) {
        if (err || !qrcode) {
            School.findById(schoolId, 'qrcode username')
                .lean()
                .exec(function (err, school) {
                    if (err || !school) {
                        return next(err || '学校信息不存在');
                    }
                    var qrcode = school.qrcode;
                    if (qrcode) {
                        redis.set(key, qrcode);
                        req.qrcode = qrcode;
                    } else {
                        req.school = school;
                    }
                    return next();
                });
        } else {
            req.qrcode = qrcode;
            next();
        }
    });
};

/**
 * 生成二维码
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
exports.generateQrcode = function (req, res, next) {
    if (req.qrcode) {
        return next();
    }
    if (!req.school) {
        return next('学校信息不存在');
    }
    request(apiUrl + '/api/v1/public/sdk/generateBinary?role=school&scene=' + req.school.username,
        function (err, response, qr) {
            if (err || response.statusCode !== 200) {
                return next(err || '生成二维码失败');
            }
            if (typeof qr === 'string') {
                qr = JSON.parse(qr);
            }
            School.update({_id: req.school._id}, {$set: {qrcode: qr.url}}).exec();
            req.qrcode = qr.url;
            return next();
        })
};
