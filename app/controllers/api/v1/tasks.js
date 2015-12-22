/**
 * Created by Frank on 15/12/22.
 */
'use strict';
const service = require('../../../services');

module.exports = function (router) {

    router.put('/:id/close', function*() {
        let taskId = this.params.id;
        this.body = yield service.tasks.closeTaskById(taskId);
    });

    router.put('/:id', function*() {
        let taskId = this.params.id;
        this.body = yield service.tasks.updateTaskById(taskId, this.request.body);
    });

};
