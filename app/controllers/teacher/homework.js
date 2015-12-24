/**
 * Created by Frank on 15/12/22.
 */
'use strict';

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
        let quizId = this.query.quizId;
        if (quizId) {
            this.state.quiz = yield service.quizzes.useById(quizId);
        }
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
        yield this.render('backend/teacher/homework/list-homework')
    });


    router.get('/:homeworkId([a-f0-9]{24})', function*() {
        let homeworkId = this.params.homeworkId;
        this.state.homework = yield service.homework.getClassHomework(homeworkId);

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