/**
 * Created by Frank on 16/1/11.
 */
'use strict';
const mongoose = require('mongoose');
const Event = mongoose.model('Event');
const service = require('../../../../services');
const articleService = service.events.article;

module.exports = function (router) {

    router.post('/', function*() {
        let articleId = this.request.body.articleId;
        if (articleId) {
            this.body = yield articleService.updateById(articleId, this.request.body);
            return;
        }
        this.body = yield articleService.create(this.user, this.request.body);
    });


    router.put('/:id', function*() {
        let articleId = this.params.id;
        this.body = yield articleService.updateById(articleId, this.request.body);
    });

};