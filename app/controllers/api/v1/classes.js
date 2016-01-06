/**
 * Created by Frank on 15/12/19.
 */
'use strict';
const _ = require('lodash');
const service = require('../../../services');

module.exports = function (router) {

    //TODO 修改为通过ID获取
    router.get('/me', function*() {
        let owner = this.user;
        let classes = yield service.classes.findByTeacher(owner._id);
        let counts = yield _.map(classes, clazz => {
            return service.students.countByClass(clazz._id);
        });
        _.forEach(classes, (clazz, index) => {
            clazz.studentsCount = counts[index];
        });
        this.body = classes;
    });

    router.put('/changeOwner', function*() {
        this.body = yield service.classes.changeOwner(this.request.body);
    });

    router.delete('/:id', function*() {
        this.body = yield service.classes.deleteById(this.params.id);
    });

    router.get('/empty/students', function*() {
        let user = this.user;
        this.body = yield service.students.findByNoneClass(user.schoolId);
    });

    router.get('/:id/students', function*() {
        let query = this.query;
        let classId = this.params.id;
        let filter = {
            where: {}
        };
        let isPage = false;
        //服务器分页处理
        if (query.draw && query.length) {
            isPage = true;
            let search = query.search && query.search.value;
            if (search && '' !== search.trim()) {
                let regx = new RegExp(search);
                filter.where.or = [{'displayName': regx}, {username: regx}];
            }
            filter.limit = query.length;
            filter.skip = query.start
        }
        let students = yield service.students.findByClass(classId, filter);
        if (isPage) {
            let count = yield service.students.countByClass(classId);
            return this.body = {
                draw: query.draw,
                recordsTotal: count,
                recordsFiltered: count,
                data: students
            };
        }
        this.body = students;
    });

    router.post('/', function*() {
        let user = this.user;
        this.body = yield service.classes.create(user, this.request.body);
    });

    router.put('/:id', function*() {
        this.body = yield service.classes.updateById(this.params.id, this.request.body);
    });

    router.delete('/:classId/students/:studentId', function*() {
        let classId = this.params.classId;
        let studentId = this.params.studentId;
        this.body = yield service.classes.deleteStudentByIds(classId, studentId);
    });

    router.delete('/:classId/students', function*() {
        let classId = this.params.classId;
        let studentIds = this.request.body.students;
        this.body = yield service.classes.deleteStudentByIds(classId, studentIds);
    });

    router.post('/:classId/students', function*() {
        let classId = this.params.classId;
        this.body = yield service.students.createStudent(classId, this.request.body);

    });

    router.put('/:classId/students', function*() {
        let classId = this.params.classId;
        this.body = yield service.classes.addStudent(classId, this.request.body);

    });

    return router;
};