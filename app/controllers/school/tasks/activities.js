/**
 * Created by Frank on 15/12/18.
 */
'use strict';

const _ = require('lodash');
const service = require('../../../services');

module.exports = function (router) {

    router.get('/create', function*() {
        yield this.render('backend/school/task/activity/create-activity-task');

    });



    router.post('/', function*() {
        let user = this.user;
        yield service.tasks.createActivityTask(user.schoolId, this.request.body);
        this.redirect('/school/tasks');
    });

};