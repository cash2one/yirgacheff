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
        let filter = {
            include: {
                'category': 'name'
            }
        };
        this.body = yield service.posts.findBySchool(this.user.schoolId, filter);
    });


    return router;
};