/**
 * Created by Frank on 15/12/18.
 */
'use strict';
const qrcode = require('../../middleware/qrcode');

module.exports = function (router) {

    router.get('/', qrcode, function*() {
        yield this.render('backend/school/qrcode');
    });

    return router;
};