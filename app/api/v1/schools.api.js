'use strict';

/**
 * Module dependencies.
 */

var _ = require('lodash');
var models = require('../../models');
var utils = require('../../common/utils');
var School = models.School;
var Counter = models.Counter;

var api = exports = module.exports = {};

/**
 * 新建一个学校
 * @param req
 * @param res
 * @param next
 */
api.create = function (req, res, next) {
    Counter.generateSequence('headmaster', null, function (err, counter) {
        if (err || !counter) {
            return next(err);
        }
        var school = new School(_.assign(req.body, {
            username: counter.seq + 10000,
            password: '12345678'
        }));
        school.save(function (err, school) {
            if (err) {
                return next(err);
            }
            res.json(school);
        });
    });
};


/**
 * 获取学校列表
 * @param req
 * @param res
 */
api.list = function (req, res, next) {
    School.find(req.body, function (err, schools) {
        if (err) {
            return next(err);
        }
        res.json(schools);
    });
};


/**
 * 更新学校信息
 * @param req
 * @param res
 */
api.update = function (req, res, next) {
    School.findByIdAndUpdate(req.params.schoolId, req.body,
        function (err) {
            if (err) {
                return next(err);
            } else {
                res.sendStatus(200);
            }
        });
};


