/**
 *
 * Created by Frank on 15/6/5.
 */

'use strict';
var async = require('async');
var _ = require('lodash');
var request = require('request');
var validator = require('validator');
var models = require('../../models');
var schoolMenus = require('../../common/menus').schoolMenus;
var redis = require('../../../db/redis');
var MediaGroup = models.MediaGroup;
var Category = models.Category;
var Post = models.Post;

var siteController = {

        /**
         * 图片库
         * @param req
         * @param res
         * @param next
         */
        mediasManager: function (req, res, next) {
            var schoolId = req.user.schoolId;
            var selected = req.query.selected || null;
            MediaGroup.find({schoolId: schoolId}, 'name')
                .lean()
                .exec(function (err, groups) {
                    if (err) {
                        return next(err);
                    }
                    groups = groups || [];
                    // 默认有一个未分组
                    groups.unshift({
                        name: '未分组',
                        _id: 'unGroup'
                    });
                    return res.render('backend/school/site/list-materials',
                        _.assign({groups: groups, selected: selected}, schoolMenus.weixin));

                });
        },

        /**
         * 栏目管理
         * @param req
         * @param res
         * @returns {*}
         */
        categoriesManager: function (req, res) {
            var categories = req.categories;
            var post = req.post;
            return res.render('backend/school/site/list-categories',
                {post: post, categories: categories});
        },

        /**
         * 文章列表
         * @param req
         * @param res
         * @param next
         */
        listPosts: function (req, res, next) {
            var query = Post.find({schoolId: req.user.schoolId});
            var category = req.query.category;
            if (category && validator.isMongoId(category)) {
                query.where('category', category);
                res.locals.currentCategory = category;
            }
            res.locals.categories = req.categories;
            query.select('-content');
            query.sort('-createdTime');
            query.populate('category', 'name');
            query.lean().exec(function (err, posts) {
                if (err) {
                    return next(err);
                }
                return res.render('backend/school/site/list-posts', {posts: posts})
            });
        },

        /**
         * 修改文章
         * @param req
         * @param res
         * @param next
         */
        modifyPost: function (req, res, next) {
            async.parallel({
                categories: function (callback) {
                    Category.find({schoolId: req.user.schoolId, disabled: 0}, 'name').exec(callback);
                },
                post: function (callback) {
                    Post.findById(req.params.postId, function (err, post) {
                        if (err) {
                            return callback(err);
                        }
                        if (!post) {
                            return callback(new Error('文章不存在'));
                        }
                    });
                }
            }, function (err, results) {
                if (err) {
                    return next(err);
                }
                return res.render('backend/school/site/create-post',
                    _.assign(results, schoolMenus.schedule));
            });
        },

        /**c
         * 创建文章页面
         * @param req
         * @param res
         */
        createPost: function (req, res) {
            if (req.query.category) {
                res.locals.currentCategory = req.query.category;
            }
            return res.render('backend/school/site/create-post', {categories: req.categories});
        },

        /**
         * 创建文章
         * @param req
         * @param res
         */
        doCreatePost: function (req, res, next) {
            var post = new Post(req.body);
            post.schoolId = req.user.schoolId;
            post.save(function (err) {
                if (err) {
                    return next(err);
                }
                Category.update({_id: post.category}, {$inc: {postCount: 1}}).exec();
                return res.redirect('/school/posts');
            });
        },

        doUpdatePost: function (req, res, next) {
            var post = req.post;
            var category = post.category;
            var newCategory = req.body.category;
            _.assign(post, req.body);
            post.save(function (err) {
                if (err) {
                    return next(err);
                }
                if (category !== newCategory) {
                    Category.update({_id: category}, {$inc: {postCount: -1}}).exec();
                    Category.update({_id: newCategory}, {$inc: {postCount: 1}}).exec();
                }
                return res.redirect('/school/posts');
            });
        },


        /**
         * 修改文章页面
         * @param req
         * @param res
         */
        updatePost: function (req, res) {
            return res.render('backend/school/site/create-post',
                {post: req.post, categories: req.categories, update: true});
        }
        ,


        /**
         * 栏目列表中间件生成器
         * @param select  选中需要查询的域
         */
        categoriesMiddleware: function (select) {
            return function (req, res, next) {
                var query = Category.where('schoolId', req.user.schoolId);
                if (select) {
                    query.select(select);
                }
                query.exec(function (err, categories) {
                    if (err) {
                        return next(err);
                    }
                    req.categories = categories;
                    next();
                });
            };
        }
        ,

        /**
         * 栏目中间件
         * @param req
         * @param res
         * @param next
         * @param id
         */
        categoryById: function (req, res, next, id) {
            Category.findById(id, function (err, category) {
                if (err || !category) {
                    return next(err || '栏目不存在');
                }
                req.category = category;
                next();
            });
        }
        ,

        /**
         * 文章中间件
         * @param req
         * @param res
         * @param next
         * @param id
         */
        postById: function (req, res, next, id) {
            Post.findById(id, function (err, post) {
                if (err || !post) {
                    return next(err || '文章不存在');
                }
                req.post = post;
                next();
            });

        }
    }
    ;

module.exports = siteController;
