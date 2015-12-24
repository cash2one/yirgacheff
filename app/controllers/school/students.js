/**
 * Created by Frank on 15/12/18.
 */
'use strict';
const service = require('../../services');


module.exports = function (router) {

    router.get('/', function*() {

        let user = this.user;
        let filter = {fields: ['displayName']};
        this.state.teachers = yield service.teachers.findBySchool(user.schoolId, filter);
        yield this.render('backend/school/manager/list-students');

    });

    return router;
};