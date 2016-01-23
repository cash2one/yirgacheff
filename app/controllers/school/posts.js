/**
 * Created by Frank on 15/12/18.
 */
'use strict';
const service = require('../../services');

module.exports = function (router) {

    router.get('/', function*() {
        yield this.render('school/site/list-posts');
    });


    router.get('/create', function*() {
        let user = this.user;
        this.state.categories = yield service.categories.findBySchool(user.schoolId);
        if (this.query.category) {
            this.state.currentCategory = this.query.category;
        }
        yield this.render('school/site/create-post');
    });


    router.post('/create', function*() {
        let user = this.user;
        yield service.posts.createPost(user.schoolId, this.request.body);
        this.redirect('/school/posts');
    });

    router.post('/:id/update', function*() {
        yield service.posts.updatePostById(this.params.id, this.request.body);
        this.redirect('/school/posts');

    });

    router.put('/:id', function*() {
        let postId = this.params.id;
        yield service.posts.updatePostById(postId, this.request.body);
        this.redirect('/school/posts');
    });

    router.get('/:id', function*() {
        let user = this.user;
        let postId = this.params.id;
        this.state.categories = yield service.categories.findBySchool(user.schoolId);
        this.state.post = yield service.posts.findById(postId);
        yield this.render('school/site/create-post');
    });

    return router;

};