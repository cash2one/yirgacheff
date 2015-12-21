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
            let search = query.search && query.search.value;
            if (search && '' !== search.trim()) {
                let regx = new RegExp(search);
                filter.where.or = [{'displayName': regx}, {username: regx}];
            }
            filter.where.limit = query.length;
            filter.where.skip = query.start
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


    return router;
};