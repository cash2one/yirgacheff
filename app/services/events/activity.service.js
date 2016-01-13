/**
 * Created by Frank on 16/1/11.
 */

'use strict';

const _ = require('lodash');
const co = require('co');
const mongoose = require('mongoose');
const createError = require('http-errors');
const queryBuilder = require('../../functions/queryBuilder');
const Activity = mongoose.model('Event').discriminators.Activity;
const Enroll = mongoose.model('Enroll');

module.exports = {

    create: co.wrap(function*(creator, data) {
        let activity = new Activity(data);
        activity.creator = creator._id;
        activity.creatorRole = creator.role;
        activity.schoolId = creator.schoolId;
        activity.template = 'activity';
        let enroll = new Enroll({
            schoolId: creator.schoolId
        });
        if (data.enrollFields) {
            enroll.fields = _.map(data.enrollFields, field=> {
                return {label: field};
            });
        }
        yield enroll.save();
        activity.enroll = enroll;
        return yield activity.save();
    }),

    updateById: co.wrap(function*(id, data) {
        let activity = yield Activity.findById(id).exec();
        if (!activity) {
            throw createError(400, '活动不存在');
        }
        _.assign(activity, _.omit(data, '_id', 'enroll'));
        //TODO 修改时记录修改人员
        return yield activity.save();
    }),

    findById: co.wrap(function*(id, isLean) {
        let activity = Activity.findById(id);
        if (isLean === true) {
            activity.lean();
        }
        return yield activity.exec();
    })
};