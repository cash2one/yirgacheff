/**
 * Created by Frank on 15/7/25.
 */

var _ = require('lodash');
var models = require('../../models');
var Task = models.Task;
var Activity = models.Activity;
var api = exports = module.exports = {};


/**
 * 任务列表
 * @param req
 * @param res
 * @param next
 */
api.listTasks = function (req, res, next) {
    var query = req.query;
    delete query['__v'];
    query.schoolId = req.user.schoolId;
    Task.find(query, function (err, tasks) {
        if (err) {
            return next(err);
        }
        res.json(tasks);
    });
};

/**
 * 读取任务详情
 * @param req
 * @param res
 * @param next
 */
api.readTask = function (req, res, next) {
    res.json(req.task);

};

/**
 * 关闭任务
 * @param req
 * @param res
 * @param next
 */
api.closeTask = function (req, res, next) {
    var task = req.task;
    if (task.state === 1) {
        return next('任务已经关闭');
    }
    task.update({state: 1}, function (err) {
        if (err) {
            return next(err);
        }
        res.sendStatus(200);
    });
};

/**
 * 删除任务
 * @param req
 * @param res
 * @param next
 */
api.deleteTask = function (req, res, next) {
    var task = req.task;
    if (task.state === 0) {
        return next('任务进行中,请先关闭任务');
    }
    Task.update({_id: task._id}, {state: 2},
        function (err) {
            if (err) {
                return next(err);
            }
            res.sendStatus(200);
        });
};


/**
 * 更新任务
 * @param req
 * @param res
 * @param next
 */
api.updateTask = function (req, res, next) {
    var task = req.task;
    if (task.state === 1) {
        return next('任务已关闭,不能修改');
    }
    task.name = req.body.name;
    task.scoreAward = req.body.scoreAward;
    task.save(function (err) {
        if (err) {
            return next(err);
        }
        if (task.taskType === 1) {
            Activity.update({
                _id: task.item
            }, req.body).exec(function (err) {
                if (err) {
                    return next(err);
                }
                res.sendStatus(200);
            });
        } else {
            res.sendStatus(200);
        }
    });
};


/**
 * task 中间件
 * @param req
 * @param res
 * @param next
 * @param id
 */
api.taskById = function (req, res, next, id) {
    Task.findById(id, function (err, task) {
        if (err || !task) {
            return next(err || '任务不存在或已经被删除');
        }
        req.task = task;
        next();
    });
};





