'use strict';
var mongoose = require('mongoose'),
    async = require('async'),
    _ = require('lodash'),
    teacherMenus = require('../../common/menus').teacherMenus,
    CommunicationRecord = mongoose.model('CommunicationRecord'),
    Student = mongoose.model('Student'),
    Class = mongoose.model('Class');

/**
 * 家校通
 * @param req
 * @param res
 * @returns {*}
 */
exports.connectionPipe = function (req, res, next) {
    Class.find({owner: req.user, state: 0})
        .select('className')
        .lean()
        .exec(function (err, classes) {
            if (err) {
                return next(err);
            }
            return res.render('backend/teacher/connetion_pipe',
                _.assign({classes: classes}, teacherMenus.connection));
        });
};

/**
 * 家校通详情
 * @param req
 * @param res
 * @returns {*}
 */
exports.connectionPipeDetail = function (req, res, next) {
    var studentId = req.params.studentId;
    async.waterfall([
        function (callback) {
            Student.findById(studentId, callback);
        },
        function (student, callback) {
            CommunicationRecord
                .find({student: student})
                .populate('creator', 'displayName')
                .sort('-createdTime')
                .lean()
                .exec(function (err, records) {
                    callback(err, student, records);
                });
        }
    ], function (err, student, records) {
        if (err) {
            return next(err);
        }
        return res.render('backend/teacher/connetion_pipe_detail',
            _.assign({
                student: student,
                records: records
            }, teacherMenus.connection));
    });
};