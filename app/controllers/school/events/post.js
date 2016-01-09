/**
 * Created by Frank on 15/12/18.
 */
'use strict';
const _ = require('lodash');
const service = require('../../../services');

module.exports = function (router) {

    router.get('/create', function*() {
        yield this.render('school/common/events/post');
    });

    router.post('/create', function*() {
        let user = this.user;
        yield service.tasks.createPostTask(user.schoolId, this.request.body);
        this.redirect('/school/tasks');
    });

};