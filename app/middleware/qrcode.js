/**
 * Created by Frank on 15/7/15.
 */

'use strict';

const request = require('request');
const mongoose = require('mongoose');
const co = require('co');
const apiUrl = require('../../config/config').apiUrl;
const redis = require('../../db/redis');

const School = mongoose.model('School');

module.exports = function* (next) {
    if (!this.user) {
        this.throw(400, 'not login');
    }
    let schoolId = this.user.schoolId;
    let key = 'qrcode:' + schoolId;
    let qrcode = yield redis.get(key);
    if (qrcode) {
        this.state.qrcode = qrcode;
        return yield next;
    }
    let school = yield School.findById(schoolId)
        .select('qrcode username')
        .lean().exec();
    if (!school) {
        this.throw(400, '学校不存在');
    }
    if (school.qrcode) {
        this.state.qrcode = school.qrcode;
        return yield next;
    }
    qrcode = yield generateQrcode(school);
    yield School.update({_id: this.school._id}, {$set: {qrcode: qrcode}}).exec();
    this.state.qrcode = qrcode;
    yield next;
};


/**
 * 生成二维码
 * @param school
 * @returns {*}
 */
var generateQrcode = co.wrap(function* (school) {
    return yield new Promise(function (resolve, reject) {
        request(apiUrl + '/api/v1/public/sdk/generateBinary?role=school&scene=' + school.username,
            function (err, response, qr) {
                if (err || response.statusCode !== 200) {
                    return reject(err || new Error('生成二维码失败'));
                }
                if (typeof qr === 'string') {
                    qr = JSON.parse(qr);
                }
                resolve(qr.url);
            })
    });
});

