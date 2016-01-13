/**
 * Created by Frank on 16/1/11.
 */

'use strict';

const _ = require('lodash');
const co = require('co');
const mongoose = require('mongoose');
const createError = require('http-errors');
const queryBuilder = require('../../functions/queryBuilder');
const Article = mongoose.model('Event').discriminators.Article;

module.exports = {

    create: co.wrap(function*(creator, data) {
        let article = new Article(data);
        article.creator = creator._id;
        article.creatorRole = creator.role;
        article.schoolId = creator.schoolId;
        article.template = 'article';
        try {
            yield article.save();
        } catch (err) {
            console.error(err.errors);
            throw err;
        }
        return article;
    }),

    updateById: co.wrap(function*(id, data) {
        let article = yield Article.findById(id).exec();
        if (!article) {
            throw createError(400, '文章不存在');
        }
        _.assign(article, _.omit(data, '_id'));
        //TODO 修改时记录修改人员
        return yield article.save();
    }),

    findById: co.wrap(function*(id, isLean) {
        let article = Article.findById(id);
        if (isLean === true) {
            article.lean();
        }
        return yield article.exec();
    })
};