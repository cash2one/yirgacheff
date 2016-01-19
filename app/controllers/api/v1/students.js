/**
 * Created by Frank on 15/12/19.
 */
'use strict';
const service = require('../../../services');

module.exports = function (router) {

    router.get('/', function*() {
        let query = this.query;
        let schoolId = this.user.schoolId;
        let filter = {
            where: {}
        };
        let isPage = false;
        //说明是服务器分页处理
        if (query.draw && query.length) {
            isPage = true;
            let search = query['search[value]'];
            if (search && '' !== search.trim()) {
                let regx = new RegExp(search);
                filter.or = [{'displayName': regx}, {username: regx}];
            }
            filter.limit = query.length;
            filter.skip = query.start
        }
        let students = yield service.students.findBySchool(schoolId, filter);
        if (isPage) {
            //获取当前学校学生总数
            let count = yield service.students.countBySchool(schoolId);
            return this.body = {
                draw: query.draw,
                recordsTotal: count,
                recordsFiltered: count,
                data: students
            };
        }
        this.body = students;
    });


    router.put('/:id', function*() {
        let studentId = this.params.id;
        this.body = yield service.students.updateById(studentId, this.request.body);

    });

    router.put('/:id/score', function*() {
        let studentId = this.params.id;
        this.body = yield service.score.scoreAward(studentId, this.request.body, this.user);
    });

    router.put('/score', function*() {
        let studentIds = this.request.body.students || [];
        this.body = yield service.score.scoreAward(studentIds, this.request.body, this.user);
    });

    router.delete('/:id', function*() {
        this.body = yield service.students.deleteById(this.params.id);
    });


    return router;
};