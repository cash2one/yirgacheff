/**
 * Created by Frank on 15/12/18.
 */
'use strict';

const service = require('../../../services');

module.exports = function (router) {
    router.put('/modifyPassword', function*() {
        this.body = yield service.users.modifyPassword(this.user, this.request.body);
    });
};