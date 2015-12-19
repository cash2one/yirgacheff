'use strict';
const service = require('../../../services');

module.exports = function (router) {


    router.get('/students/count', function*() {
        let user = this.user;
        this.body = yield service.students.getCountBySchool(user.schoolId);
    });


    router.get('/classes/count', function*() {
        let user = this.user;
        this.body = yield service.classes.getCountBySchool(user.schoolId);
    });


    router.get('/teachers/count', function*() {
        let user = this.user;
        this.body = yield service.teachers.getCountBySchool(user.schoolId);
    });

    router.get('/teachers/:teacherId([a-f0-9]{24})/students/count', function*() {
        let teacherId = this.params.teacherId;
        this.body = yield service.students.getCountByTeacher(teacherId);

    });

    router.get('/teachers/:teacherId([a-f0-9]{24})/classes/count', function*() {
        let teacherId = this.params.teacherId;
        this.body = yield service.classes.getCountByTeacher(teacherId);
    });


    router.get('/homework/count', function*() {
        let user = this.user;
        this.body = yield service.homework.getCountBySchool(user.schoolId);
    });


    router.get('/teachers/:teacherId([a-f0-9]{24})/homework/count', function*() {
        this.body = yield service.homework.getCountByTeacher(this.params.teacherId);
    });


    router.get('/homework/:homeworkId([a-f0-9]{24})/wrongCount', function*() {
        this.body = yield service.homework.getWrongDistributed(this.params.homeworkId);
    });

    router.get('/students/enrolStudentsCount', function*() {
        let type = this.query.type;
        let user = this.user;
        this.body = yield service.students.enrollDistributed(type, user.schoolId);
    });

    router.get('/teachers/classCountOfTaughtRank', function*() {
        let user = this.user;
        this.body = yield service.teachers.getTopOfOwnClass(user.schoolId);
    });

    router.get('/students/scoreDistribution', function *() {
        let user = this.user;
        this.body = yield service.students.scoreDistributed(user.schoolId);
    });

    router.get('/teachers/quizContributionRank', function*() {
        let user = this.user;
        this.body = yield service.teachers.getTopOfQuiz(user.schoolId);
    });

    return router;
};
