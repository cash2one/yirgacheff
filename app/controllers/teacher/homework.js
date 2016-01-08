/**
 * Created by Frank on 15/12/22.
 */
'use strict';

const _ = require('lodash');
const service = require('../../services');

module.exports = function (router) {

    router.get('/', function*() {
        let user = this.user;
        this.state.homeworkList = yield service.homework.findByTeacher(user._id, {
            where: {
                'state': 0
            },
            fields: ['-performances'],
            order: ['-createdTime'],
            include: [{'clazz': 'className'}]
        });
        yield this.render('backend/teacher/homework/list-homework')

    });


    router.get('/create', function*() {
        this.state.classes = yield service.classes.findByTeacher(this.user._id, {
            fields: ['className']
        });
        yield this.render('backend/teacher/homework/create-homework');
    });


    router.get('/history', function*() {
        let user = this.user;
        this.state.homeworkList = yield service.homework.findByTeacher(user._id, {
            where: {
                'state': 1
            },
            fields: ['-performances'],
            order: ['-createdTime']
        });
        yield this.render('backend/teacher/homework/list-homework-history')
    });


    router.get('/:homeworkId([a-f0-9]{24})', function*() {
        let homeworkId = this.params.homeworkId;
        this.state.homework = yield service.homework.getClassHomework(homeworkId);
        yield this.render('backend/teacher/homework/view-classDetail');

    });

    router.get('/:homeworkId([a-f0-9]{24})/students/:studentId([a-f0-9]{24})', function*() {
        let homeworkId = this.params.homeworkId;
        let studentId = this.params.studentId;
        let student = yield service.students.findById(studentId, true);
        let homeworkDetail = yield service.homework.getStudentHomework(studentId, homeworkId);
        _.assign(this.state, homeworkDetail, {student});
        yield this.render('backend/teacher/homework/view-studentDetail');

    });

    router.get('/:homeworkId([a-f0-9]{24})/history', function*() {
        let homeworkId = this.params.homeworkId;
        this.state.homework = yield service.homework.getClassHomework(homeworkId);
        yield this.render('backend/teacher/homework/view-classDetail-history')
    });

    router.get('/:homeworkId([a-f0-9]{24})/students/:studentId([a-f0-9]{24})/history', function*() {
        let homeworkId = this.params.homeworkId;
        let studentId = this.params.studentId;
        let student = yield service.students.findById(studentId, true);
        let homeworkDetail = yield service.homework.getStudentHomework(studentId, homeworkId);
        _.assign(this.state, homeworkDetail, {student});
        yield this.render('backend/teacher/homework/view-studentDetail-history');

    });

    return router;
};