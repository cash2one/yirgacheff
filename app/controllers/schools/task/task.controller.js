/**
 * Created by Frank on 15/8/4.
 */

'use strict';
var _ = require('lodash');
var models = require('../../../models');
var activity = require('./activity.controller');
var post = require('./post.controller');
var lottery = require('./lottery.controller');
var Task = models.Task;

var controller = {
    /**
     * 任务列表
     * @param req
     * @param res
     * @returns {*}
     */
    taskManager: function (req, res) {
        Task.find({
            schoolId: req.user.schoolId
        }).where('state').ne(2)
            .sort('-createdTime')
            .exec(function (err, tasks) {
                if (err) {
                    return next(err);
                }
                return res.render('backend/school/task/list-tasks', {tasks: tasks});
            });
    },

    /**
     * 创建任务页面
     * @param req
     * @param res
     * @returns {*}
     */
    createTask: function (req, res) {
        return res.render('backend/school/task/create-task');
    },


    viewTask: function (req, res, next) {
        Task.findById(req.params.taskId, function (err, task) {
            if (err) {
                return next(err);
            }
            if (!task) {
                return next('任务不存在');
            }
            req.task = task;
            switch (task.taskType) {
                case(0):
                    post.viewPostTask(req, res, next);
                    break;
                case(1):
                    activity.viewActivityTask(req, res, next);
                    break;
                case(2):
                    lottery.viewLotteryTask(req, res, next);
                    break;

                default :
                    next('任务类型不存在')
            }
        });
    }
};

module.exports = exports = controller;


