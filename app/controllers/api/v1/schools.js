/**
 * Created by Frank on 15/12/28.
 */
'use strict';
const service = require('../../../services');

module.exports = function (router) {

    router.put('/:id', function *() {
        let schoolId = this.params.id;
        this.body = yield service.schools.updateById(schoolId, this.request.body);

    });
};