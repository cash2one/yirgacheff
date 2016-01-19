/**
 * Created by Frank on 16/1/20.
 */
'use strict';
const qrcode = require('../../middleware/qrcode');

module.exports = function (router) {

    router.get('/', qrcode(), function*() {
        this.state.qrcode = this.qrcode;
        this.state.privateQrcode = this.privateQrcode;
        yield this.render('common/qrcode');
    });

    return router;
};