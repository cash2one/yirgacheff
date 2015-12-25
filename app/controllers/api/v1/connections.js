/**
 * Created by Frank on 15/12/23.
 */
'use strict';
const service = require('../../../services');

module.exports = function (router) {

    router.post('/students/:studentId', function*() {
        let user = this.user;
        let studentId = this.params.studentId;
        this.body = yield service.connections.createRecord(user._id, studentId, this.request.body);
    });
};