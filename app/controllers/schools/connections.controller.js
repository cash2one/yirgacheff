/**
 * Created by Frank on 15/5/6.
 */
'use strict';

var async = require('async');
var models = require('../../models');
var CommunicationRecord = models.CommunicationRecord;
var Student = models.Student;


/**
 * 电话纪录详情
 * @param req
 * @param res
 * @returns {*}
 */
exports.connectionDetail = function (req, res, next) {
    var studentId = req.params.studentId;
    async.parallel({
        student: function (callback) {
            Student.findById(studentId, callback);
        },
        records: function (callback) {
            CommunicationRecord.find({student: studentId})
                .populate('creator', 'displayName')
                .sort('-createdTime')
                .exec(callback);
        }
    }, function (err, result) {
        if (err) {
            return next(err);
        }
        return res.render('backend/school/manager/view-student', result);
    });
};
