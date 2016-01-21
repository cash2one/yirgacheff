/**
 * Created by Frank on 15/12/21.
 */
'use strict';

const service = require('../../../services');
module.exports = function (router) {

    router.get('/', function*() {
        let user = this.user;
        this.body = yield service.medias.findBySchool(user.schoolId);
    });

    router.post('/', function*() {
        let user = this.user;
        this.body = yield service.medias.createMedias(user.schoolId, this.request.body);
    });

    router.delete('/', function*() {
        this.body = yield service.medias.deleteByIds(this.request.body.medias);
    });

    router.delete('/:id', function*() {
        this.body = yield service.medias.deleteByIds(this.params.id);
    });

    return router;

};