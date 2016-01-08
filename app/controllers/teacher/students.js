/**
 * Created by Frank on 15/12/22.
 */

'use strict';
const _ = require('lodash');
const service = require('../../services');

module.exports = function (router) {

    router.get('/:studentId', function*() {
        let studentId = this.params.studentId;
        let student = yield service.students.findById(studentId);
        yield student.populate('classes', 'className ownerDisplayName').execPopulate();
        this.state.student = student;
        yield this.render('backend/teacher/manager/view-student');
    });

    router.get('/', function*() {
        this.state.classes = yield service.classes.findByTeacher(this.user._id);
        if (this.query.clazz) {
            this.state.selectedClass = this.query.clazz;
        }
        yield this.render('backend/teacher/manager/list-students');
    });

    router.get('/:studentId/phoneRecords', function*() {
        let studentId = this.params.studentId;
        let ret = yield {
            student: service.students.findById(studentId),
            records: service.connections.findByStudent(studentId, {
                include: [{'creator': 'displayName'}],
                order: ['-createdTime']
            })
        };
        _.assign(this.state, ret);
        yield this.render('backend/teacher/manager/list-phone-records');
    });

    router.get('/:studentId/scoreRecords', function*() {
        let studentId = this.params.studentId;
        let ret = yield {
            student: yield service.students.findById(studentId, true),
            logs: yield service.score.logByStudent(studentId)
        };
        _.assign(this.state, ret);
        yield this.render('backend/teacher/manager/list-score-records');
    });

    return router;

};