/**
 * Created by Frank on 15/12/21.
 */
'use strict';
const service = require('../../../services');
const categories = service.categories;
module.exports = function (router) {

    router.get('/', function*() {
        let user = this.user;
        this.body = yield categories.findBySchool(user.schoolId);
    });

    router.put('/:id', function*() {
        let categoryId = this.params.id;
        this.body = yield categories.updateById(categoryId, this.request.body);
    });

    router.get('/:id', function*() {
        let categoryId = this.params.id;
        this.body = yield categories.findById(categoryId, true);

    });

    router.delete('/:id', function*() {
        let categoryId = this.params.id;
        this.body = yield categories.deleteById(categoryId);

    });

    router.post('/', function*() {
        let user = this.user;
        this.body = yield categories.create(user.schoolId, this.request.body);

    });
};