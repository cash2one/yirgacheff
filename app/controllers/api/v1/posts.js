/**
 * Created by Frank on 15/12/21.
 */
'use strict';
const service = require('../../../services');

module.exports = function (router) {

    router.post('/', function*() {
        let postId = this.request.body.postId;
        if (postId) {
            this.body = yield service.posts.updatePostById(postId, this.request.body);
            return;
        }
        this.body = yield service.posts.createPost(this.user.schoolId, this.request.body);
    });

    router.put('/:id', function*() {
        this.body = yield service.posts.updatePostById(this.params.id, this.request.body);
    });

    router.delete('/:id', function*() {
        let postId = this.params.id;
        this.body = yield service.posts.deleteById(postId);
    });

    router.get('/', function*() {
        let query = this.query;
        let filter = {
            include: {
                'category': 'name'
            },
            order: ['-createdTime']
        };
        if (query.limit) {
            filter.limit = query.limit;
        }
        if (query.skip) {
            filter.skip = query.skip;
        }
        if (query.category) {
            filter.where = {category: query.category};
        }
        filter.fields = ['title image createdTime visitCount like category'];
        this.body = yield {
            total: service.posts.countBySchool(this.user.schoolId, query.category),
            posts: service.posts.findBySchool(this.user.schoolId, filter)
        };
    });
    return router;
};