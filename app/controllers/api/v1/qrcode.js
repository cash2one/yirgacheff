/**
 * Created by Frank on 16/1/8.
 */
'use strict';
const service = require('../../../services');

module.exports = function (router) {

    router.put('/', function*() {
        let user = this.user;
        this.body = yield service.schools.updateById(user.schoolId, {
            privateQrcode: this.request.body.qrcode
        });
    });

};