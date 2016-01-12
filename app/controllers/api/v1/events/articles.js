/**
 * Created by Frank on 16/1/11.
 */
'use strict';
const mongoose = require('mongoose');
const Event = mongoose.model('Event');
const service = require('../../../../services');
const articleService = service.events.article;

module.exports = function (router) {

    router.get('/', function*() {
        let Article = Event.discriminators.Article;
        this.body = yield Article.find({}).exec();
    });




    router.post('/', function*() {
        let articleId = this.request.body.articleId;
        if (articleId) {
            this.body = yield articleService.updateById(articleId, this.request.body);
            return;
        }
        this.body = yield articleService.create(this.user, this.request.body);
    });


    router.put('/articleId', function*() {
        let articleId = this.params.articleId;
        this.body = yield articleService.updateById(articleId, this.request.body);
    });

};