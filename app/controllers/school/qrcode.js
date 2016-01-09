/**
 * Created by Frank on 15/12/18.
 */
'use strict';
const qrcode = require('../../middleware/qrcode');

module.exports = function (router) {

    router.get('/', qrcode(), function*() {
        this.state.qrcode = this.qrcode;
        this.state.privateQrcode = this.privateQrcode;
        yield this.render('school/qrcode');
    });

    return router;
};