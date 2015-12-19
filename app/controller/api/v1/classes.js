/**
 * Created by Frank on 15/12/19.
 */
'use strict';
const service = require('../../../services');

module.exports = function (router) {

    router.put('/:id/changeOwner', function*() {
        let owner = this.request.body.username;
        let classId = this.params.id;
        this.body = yield service.classes.changeOwner(classId, owner);
    });

    return router;
};