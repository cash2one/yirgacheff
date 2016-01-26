/**
 * Created by Frank on 15/12/21.
 */
'use strict';
const mongoose = require('mongoose');
const co = require('co');
const _ = require('lodash');
const createError = require('http-errors');
const queryBuilder = require('../functions/queryBuilder');
const Post = mongoose.model('Post');
const Category = mongoose.model('Category');

module.exports = {

    findBySchool: co.wrap(function*(schoolId, filter) {
        let query = Post.find({
            schoolId: schoolId
        });
        if (!_.isEmpty(filter)) {
            queryBuilder(query, filter);
        }
        return yield query.lean().exec();
    }),

    countBySchool: co.wrap(function*(schoolId, category) {
        let filter = {
            schoolId: schoolId
        };
        if (category && category !== null) {
            filter.category = category;
        }
        return yield Post.count(filter).exec();
    }),

    deleteById: co.wrap(function*(id) {
        let post = yield Post.findById(id).select('_id category').exec();
        if (!post) {
            throw createError(400, '文章不存在');
        }
        yield Category.update({_id: post.category}, {$inc: {postCount: -1}}).exec();
        return yield post.remove();
    }),

    createPost: co.wrap(function*(schoolId, data) {
        let post = new Post(data);
        post.schoolId = schoolId;
        yield post.save();
        yield Category.update({_id: post.category}, {$inc: {postCount: 1}}).exec();
        return post;
    }),

    updatePostById: co.wrap(function*(id, data) {
        let post = yield Post.findById(id).select('_id').exec();
        if (!post) {
            throw createError(400, '文章不存在');
        }
        _.assign(post, data);
        return yield post.save();
    }),

    findById: co.wrap(function*(id) {
        return yield Post.findById(id).exec();
    })
};
