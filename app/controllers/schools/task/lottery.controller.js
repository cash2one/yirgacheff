/**
 * Created by Frank on 15/8/4.
 */
var async = require('async');
var models = require('../../../models');
var Task = models.Task;
//var Activity = models.Activity;
//var ActivityCollect = models.ActivityCollect;

var controller = {
    /**
     * 创建幸运转盘页面
     * @param req
     * @param res
     */
    createLotteryShare: function (req, res) {
        res.render('backend/school/task/lottery/create-lottery-task');
    },

    viewLotteryTask: function (req, res, next) {

    },

    statisticsManager: function (req, res) {
        res.render('backend/school/statistics/statistics');
    }

};

module.exports = exports = controller;

