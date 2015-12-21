/**
 * Created by Frank on 15/12/21.
 */
'use strict';

const service = require('../../../services');
module.exports = function (router) {

    router.put('/changeGroup', function*() {
        let medias = this.request.body.medias;
        let group = this.request.body.group;
        this.body = yield service.medias.changeGroup(medias, group);
    });


    router.post('/', function*() {
        let user = this.user;
        this.body = yield service.medias.createMedias(user.schoolId, this.request.body);
    });


    router.delete('/', function*() {
        this.body = yield service.medias.deleteMediaByIds(this.request.body.medias);
    });

    return router;

};