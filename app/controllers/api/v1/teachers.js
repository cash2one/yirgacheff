/**
 * Created by Frank on 15/12/18.
 */
'use strict';
const service = require('../../../services');

module.exports = function (router) {

    router.get('/', function*() {
        let user = this.user;
        this.body = yield service.teachers.findBySchool(user.schoolId);
    });

    router.post('/', function*() {
        let user = this.user;
        let teacher = this.request.body;
        if (teacher._id) {
            this.body = yield service.teachers.updateById(teacher._id, teacher);
            return;
        }
        this.body = yield service.teachers.create(user.schoolId, this.request.body);
    });

    router.put('/:id', function*() {
        this.body = yield service.teachers.updateById(this.params.id, this.request.body);
    });

    router.del('/:id', function*() {
        this.body = yield service.teachers.deleteById(this.params.id);
    });

    router.put('/:id/enable', function*() {
        this.body = yield service.teachers.updateById(this.params.id, {state: 0});
    });

    router.get('/disabled', function*() {
        let filter = {where: {state: 1}};
        let user = this.user;
        this.body = yield service.teachers.findBySchool(user.schoolId, filter);
    });


    router.get('/:id/students', function*() {
        let query = this.query;
        let teacherId = this.params.id;
        let filter = {
            where: {}
        };
        let isPage = false;
        //说明是服务器分页处理
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
        let students = yield service.students.findByTeacher(teacherId, filter);
        if (isPage) {
            //获取当前学校学生总数
            let count = yield service.students.countByTeacher(teacherId);
            return this.body = {
                draw: query.draw,
                recordsTotal: count,
                recordsFiltered: count,
                data: students
            };
        }
        this.body = students;
    });

    router.get('/:id/classes', function*() {
        let teacherId = this.params.id;
        this.body = yield service.classes.findByTeacher(teacherId);
    });
};