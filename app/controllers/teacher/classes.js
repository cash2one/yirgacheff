/**
 * Created by Frank on 15/12/22.
 */
'use strict';
const service = require('../../services');

module.exports = function (router) {

    router.get('/', function*() {
        yield this.render('teacher/manager/list-classes');
    });

    router.get('/:id', function*() {
        let classId = this.params.id;
        this.state.clazz = yield service.classes.findById(classId, true);
        this.state.studentCount = yield service.students.countByClass(classId);
        this.state.classes = yield service.classes.findByTeacher(this.user._id);
        yield this.render('teacher/manager/view-class');
    });

    router.get('/:id/nameList', function*() {

    });

    return router;
};