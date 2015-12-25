/**
 * Created by Frank on 15/12/23.
 */
'use strict';
const mongoose = require('mongoose');
const co = require('co');
const _ = require('lodash');
const queryBuilder = require('../functions/queryBuilder');
const createError = require('http-errors');
const CommunicationRecord = mongoose.model('CommunicationRecord');
const Student = mongoose.model('Student');


module.exports = {

    findByStudent: co.wrap(function*(studentId, filter) {
        let query = CommunicationRecord.find({student: studentId});
        if (!_.isEmpty(filter)) {
            queryBuilder(query, filter);
        }
        return yield query.lean().exec();
    }),

    createRecord: co.wrap(function*(creator, studentId, data) {
        let student = yield Student.findById(studentId).select('_id schoolId').exec();
        if (!student) {
            throw createError(400, '学生不存在');
        }
        let record = new CommunicationRecord(data);
        _.assign(record, {
            schoolId: student.schoolId,
            student: student,
            creator: creator
        });
        return yield record.save();
    })

};