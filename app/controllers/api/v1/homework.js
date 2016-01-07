/**
 * Created by Frank on 16/1/7.
 */
'use strict';
const service = require('../../../services');

module.exports = function (router) {

    router.post('/', function*() {
        let user = this.user;
        this.body = yield service.homework.create(user, this.request.body);
    });

    router.delete('/:homeworkId', function*() {
        let homeworkId = this.params.homeworkId;
        this.body = yield service.homework.deleteById(homeworkId);
    });
    return router;
};