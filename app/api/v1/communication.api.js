'use strict';

var _ = require('lodash');

var CommunicationRecord = require('../../models/').CommunicationRecord;

var api = exports = module.exports = {};

/**
 * 新建电话记录
 * @param req
 * @param res
 * @param next
 */
api.create = function (req, res, next) {
    var data = _.assign(req.body, {
        schoolId: req.user.schoolId,
        student: req.params.studentId,
        creator: req.user
    });
    var record = new CommunicationRecord(data);
    record.save(function (err) {
        if (err) {
            return next(err);
        }
        res.json(record);
    });
};
