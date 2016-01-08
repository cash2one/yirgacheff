/**
 * Created by Frank on 15/12/18.
 */
'use strict';
const _ = require('lodash');
const service = require('../../services');


module.exports = function (router) {

    router.get('/', function*() {

        let user = this.user;
        let filter = {fields: ['displayName']};
        this.state.teachers = yield service.teachers.findBySchool(user.schoolId, filter);
        yield this.render('backend/school/manager/list-students');

    });

    router.get('/noneClass', function*() {
        yield this.render('backend/school/manager/list-students-noneClass');
    });


    router.get('/:studentId', function*() {
        let studentId = this.params.studentId;
        let ret = yield {
            student: service.students.findById(studentId)
        };
        _.assign(this.state, ret);
        yield this.render('backend/school/manager/view-student');
    });

    router.get('/connect/:studentId', function*() {
        let studentId = this.params.studentId;
        let ret = yield {
            student: service.students.findById(studentId),
            records: service.connections.findByStudent(studentId, {
                include: [{'creator': 'displayName'}],
                order: ['-createdTime']
            })
        };
        _.assign(this.state, ret);
        yield this.render('backend/school/manager/list-records');
    });

    router.get('/scores/:studentId', function*() {
        let studentId = this.params.studentId;
        let ret = yield {
            student: service.students.findById(studentId)
        };
        _.assign(this.state, ret);
        yield this.render('backend/school/manager/scores-student');
    });

    return router;
};