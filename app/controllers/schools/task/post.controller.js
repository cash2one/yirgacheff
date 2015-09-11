/**
 * Created by Frank on 15/8/4.
 */

var async = require('async');
var models = require('../../../models');
var Post = models.Post;
var Category = models.Category;
var Task = models.Task;

var controller = {
    /**
     *
     * 创建文章分享任务
     * @param req
     * @param res
     */
    createPostShare: function (req, res) {
        var schoolId = req.user.schoolId;
        async.parallel(({
            posts: function (callback) {
                Post.find({
                    schoolId: schoolId
                }).select('title category image').sort('-createdTime').exec(callback);
            },
            categories: function (callback) {
                Category.find({
                    schoolId: schoolId
                }).select('name').exec(callback);
            }
        }), function (err, results) {
            if (err) {
                return next(err);
            }
            return res.render('backend/school/task/post/create-post-task', {
                posts: results.posts,
                categories: results.categories
            });
        });
    },

    /**
     * 创建文章类分享
     * @param req
     * @param res
     */
    doCreatePostShare: function (req, res) {
        var task = new Task(req.body);
        task.schoolId = req.user.schoolId;
        task.taskType = 0;
        task.save(function (err) {
            if (err) {
                return next(err);
            }
            res.redirect('/school/tasks');
        });
    },

    /**
     * 查看任务详情
     * @param req
     * @param res
     * @param next
     */
    viewPostTask: function (req, res, next) {
        var task = req.task;
        task.populate({
            path: 'item',
            model: 'Post',
            select: '-content'
        }, function (err, task) {
            if (err) {
                return next(err);
            }
            res.render('backend/school/task/post/view-post-task', {task: task});
        });
    }
};


module.exports = exports = controller;
