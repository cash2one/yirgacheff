/**
 * Created by Frank on 15/7/15.
 */

'use strict';
const request = require('request');
const mongoose = require('mongoose');
const co = require('co');
const apiUrl = require('../../config/config').apiUrl;
const Qrcode = require('yaqrcode');
const School = mongoose.model('School');

module.exports = function (opts) {
    return function* (next) {
        let size = (opts && opts.size) || this.query.size;
        if (size) {
            size = parseInt(size);
        }
        if (!size || isNaN(size)) {
            size = 300;
        }
        size = Math.min(size, 600);
        if (!this.user) {
            this.throw(400, 'not login');
        }
        let school = yield School.findById(this.user.schoolId)
            .select('qrcode username privateQrcode')
            .lean().exec();
        console.log(school);
        let qrcode = school.qrcode;
        if (!qrcode) {
            qrcode = yield generateQrcode(school);
            yield School.update({_id: school._id}, {$set: {qrcode: qrcode}}).exec();
        }
        this.qrcode = Qrcode(qrcode, {size: size});
        this.privateQrcode = school.privateQrcode;
        yield next;
    };
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

