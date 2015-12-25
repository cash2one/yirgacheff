/**
 * Created by Frank on 15/12/18.
 */
'use strict';
const _ = require('lodash');
const service = require('../../../services');

module.exports = function (router) {

    router.get('/create', function*() {
        let user = this.user;
        let result = yield {
            posts: service.posts.findBySchool(user.schoolId, {fields: ['title', 'category', 'image']}),
            categories: service.categories.findBySchool(user.schoolId, {fields: ['name']})
        };
        _.assign(this.state, result);
        yield this.render('backend/school/task/post/create-post-task');
    });

    router.post('/create', function*() {
        let user = this.user;
        yield service.tasks.createPostTask(user.schoolId, this.request.body);
        this.redirect('/school/tasks');
    });

};