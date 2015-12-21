/**
 * Created by Frank on 15/12/18.
 */
'use strict';
const service = require('../../services');

module.exports = function (router) {
    router.get('/', function*() {
        let user = this.user;
        let filter = {
            fields: ['-content'],
            order: ['-createdTime'],
            include: {
                'category': 'name'
            },
            where: {}
        };
        if (this.query.category) {
            filter.where.category = this.query.category;
            this.state.currentCategory = this.query.category;
        }
        this.state.categories = yield service.categories.findBySchool(user.schoolId);
        this.state.posts = yield service.posts.findBySchool(user.schoolId, filter);
        yield this.render('backend/school/site/list-posts');
    });

    router.get('/create', function*() {
        let user = this.user;
        this.state.categories = yield service.categories.findBySchool(user.schoolId);
        if (this.query.category) {
            this.state.currentCategory = this.query.category;
        }
        yield this.render('backend/school/site/create-post');
    });

    return router;
};