/**
 * Created by Frank on 15/12/18.
 */
'use strict';

const service = require('../../services');

module.exports = function (router) {

    router.get('/', function*() {
        let user = this.user;
        this.state.selected = this.query.selected || null;
        this.state.groups = yield service.medias.findGroupBySchool(user.schoolId);
        yield this.render('backend/school/site/list-materials');
    });
};

