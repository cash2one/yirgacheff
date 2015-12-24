/**
 * Created by Frank on 15/12/21.
 */
'use strict';
const service = require('../../../services');

module.exports = function (router) {

    router.post('/', function*() {
        let user = this.user;
        this.body = yield service.create(user, this.request.body);
    });


    router.get('/', function*() {
        let query = this.query;
        let schoolId = this.user.schoolId;
        let filter = {
            where: {},
            fields: ['-exercises'],
            order: ['-createdTime']
        };
        let isPage = false;
        //说明是服务器分页处理
        if (query.draw && query.length) {
            isPage = true;
            let search = query.search && query.search.value;
            if (search && '' !== search.trim()) {
                let regx = new RegExp(search);
                filter.where.or = [{'creatorDisplayName': regx}, {title: regx}];
            }
            filter.limit = query.length;
            filter.skip = query.start
        }
        let quizzes = yield service.quizzes.findBySchool(schoolId, filter);
        if (isPage) {
            //获取当前学校学生总数
            let count = yield service.quizzes.countBySchool(schoolId);
            return this.body = {
                draw: query.draw,
                recordsTotal: count,
                recordsFiltered: count,
                data: quizzes
            };
        }
        this.body = quizzes;
    });

    router.delete('/:id', function*() {
        let quizId = this.params.id;
        this.body = yield service.quizzes.deleteById(quizId);
    });
};