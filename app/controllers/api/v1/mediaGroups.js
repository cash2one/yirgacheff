/**
 * Created by Frank on 15/12/21.
 */
'use strict';
const service = require('../../../services');

module.exports = function (router) {

    router.get('/', function*() {
        let user = this.user;
        this.body = yield service.medias.findGroupBySchool(user.schoolId);
    });

    router.post('/', function*() {
        let user = this.user;
        this.body = yield service.medias.createGroup(user.schoolId, this.request.body);
    });

    router.get('/unGroup/medias', function*() {
        let user = this.user;
        this.body = yield service.medias.findMediaByGroup(user.schoolId, null);
    });

    router.get('/medias/count', function*() {
        let user = this.user;
        this.body = yield service.medias.mediasCountMapper(user.schoolId);
    });

    router.get('/:id/medias', function*() {
        let user = this.user;
        let groupId = this.params.id;
        this.body = yield service.medias.findMediaByGroup(user.schoolId, groupId);

    });

    router.delete('/:groupId', function*() {
        let groupId = this.params.groupId;
        this.body = yield service.medias.deleteGroupById(groupId);
    });


    return router;
};