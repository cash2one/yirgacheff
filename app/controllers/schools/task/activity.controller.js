/**
 * Created by Frank on 15/8/4.
 */
var async = require('async');
var models = require('../../../models');
var Task = models.Task;
var Activity = models.Activity;
var ActivityCollect = models.ActivityCollect;

var controller = {
    /**
     * 创建活动分享页面
     * @param req
     * @param res
     */
    createActivityShare: function (req, res) {
        res.render('backend/school/task/activity/create-activity-task');
    },

    /**
     * 创建活动分享任务
     * @param req
     * @param res
     */
    doCreateActivityTask: function (req, res, next) {
        var activity = new Activity(req.body);
        var task = new Task(req.body);
        task.taskType = 1;
        activity.schoolId = req.user.schoolId;
        task.schoolId = req.user.schoolId;
        activity.save(function (err, activity) {
            if (err) {
                return next(err);
            }
            task.item = activity;
            task.save(function (err) {
                if (err) {
                    activity.remove(function (err) {
                        if (err) console.log(err);
                    });
                    return next(err);
                }
                res.redirect('/school/tasks');
            })
        });
    },

    /**
     * 查看任务详情
     * @param req
     * @param res
     * @param next
     */
    viewActivityTask: function (req, res, next) {
        var task = req.task;
        async.parallel({
            task: function (callback) {
                task.populate({
                    path: 'item',
                    model: 'Activity'
                }, callback);
            },
            collect: function (callback) {
                ActivityCollect.find({
                    activity: task.item
                }).lean().exec(callback);
            }
        }, function (err, results) {
            if (err) {
                return next(err);
            }
            res.render('backend/school/task/activity/view-activity-task', results);
        })
    }
};

module.exports = exports = controller;

