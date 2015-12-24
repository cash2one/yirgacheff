/**
 * Created by Frank on 15/12/21.
 */
'use strict';
const service = require('../../../services');

module.exports = function (router) {

    router.delete('/:id', function*() {
        let postId = this.params.id;
        this.body = yield service.posts.deleteById(postId);
    });

    return router;
};