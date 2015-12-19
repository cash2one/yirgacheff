/**
 * Created by Frank on 15/12/18.
 */
'use strict';
const service = require('../../../services');

module.exports = function (router) {

    router.get('/', function*() {
        let user = this.user;
        this.body = yield service.teachers.findBySchool(user.schoolId);
    });

    router.post('/', function*() {
        let user = this.user;
        this.body = yield service.teachers.create(user.schoolId, this.request.body);
    });

    router.put('/:id', function*() {
        this.body = yield service.teachers.updateById(this.params.id, this.request.body);
    });

    router.del('/:id', function*() {
        this.body = yield service.teachers.deleteById(this.params.id);
    });

    router.put('/:id/enable', function*() {
        this.body = yield service.teachers.updateById(this.params.id, {state: 0});
    });

    router.get('/disabled', function*() {
        let filter = {where: {state: 1}};
        let user = this.user;
        this.body = yield service.teachers.findBySchool(user.schoolId, filter);
    });

};