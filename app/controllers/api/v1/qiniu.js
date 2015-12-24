/**
 * Created by Frank on 15/12/20.
 */
'use strict';
const qiniu = require('../../../middleware/qiniu');

module.exports = function (router) {
    router.get('/imageToken', qiniu.imageToken, function*() {
        this.body = {
            uptoken: this.token
        };
    });

    router.get('/audioToken', qiniu.audioToken, function*() {
        this.body = {
            uptoken: this.token
        };
    });
};