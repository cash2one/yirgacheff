/**
 * Created by Frank on 15/12/22.
 */

'use strict';
const service = require('../../services');

module.exports = function (router) {

    router.get('/', function*() {
        this.state.classes = yield service.classes.findByTeacher(this.user._id);
        if (this.query.clazz) {
            this.state.selectedClass = this.query.clazz;
        }
        yield this.render('backend/teacher/manager/list-students');
    });

    return router;

};