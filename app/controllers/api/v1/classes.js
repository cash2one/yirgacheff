/**
 * Created by Frank on 15/12/19.
 */
'use strict';
const service = require('../../../services');

module.exports = function (router) {

    router.put('/:id/changeOwner', function*() {
        let owner = this.request.body.username;
        let classId = this.params.id;
        this.body = yield service.classes.changeOwner(classId, owner);
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
            filter.where.limit = query.length;
            filter.where.skip = query.start
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

    return router;
};