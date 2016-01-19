/**
 * Created by Frank on 16/1/11.
 */
'use strict';
const _ = require('lodash');
const co = require('co');
const mongoose = require('mongoose');
const createError = require('http-errors');
const queryBuilder = require('../../functions/queryBuilder');
const Event = mongoose.model('Event');
const Enroll = mongoose.model('Enroll');
const ScoreTask = mongoose.model('ScoreTask');

module.exports = {

    findBySchool: co.wrap(function*(schoolId, filter) {
        let query = Event.find({schoolId: schoolId});
        if (filter) {
            query = queryBuilder(query, filter);
        }
        return yield query.lean().exec();
    }),

    findById: co.wrap(function*(id, isLean) {
        let query = Event.findById(id);
        if (isLean === true) {
            query.lean();
        }
        return yield query.exec();
    }),

    deleteById: co.wrap(function*(id) {
        let event = yield Event.findById(id).select('_id').exec();
        if (!event) {
            throw createError(400, '活动不存在');
        }
        //如果存在报名则删除报名信息
        if (event.enroll) {
            yield Enroll.remove({_id: event.enroll}).exec();
        }
        return yield event.remove();
    }),

    create: co.wrap(function*(creator, data) {
        let template = data.template;
        let enroll = null;
        if (_.isEmpty(template)) {
            throw new Error('缺少模版信息');
        }
        let Discriminator = Event.discriminators[template];
        if (_.isEmpty(Discriminator)) {
            throw new Error('未知的模版信息');
        }
        let event = new Discriminator(data);
        event.creator = creator._id;
        event.creatorRole = creator.role;
        event.schoolId = creator.schoolId;
        event.template = template;
        //是否需要报名
        if (needEnroll(template)) {
            enroll = new Enroll({schoolId: creator.schoolId});
            if (data.enrollFields) {
                enroll.fields = _.map(data.enrollFields, field=> {
                    return {label: field.label, inputType: 'text'};
                });
            }
            yield enroll.save();
            event.enroll = enroll;
        }
        try {
            return yield event.save();
        } catch (err) {
            if (enroll !== null) {
                yield enroll.remove();
            }
            throw err;
        }
    }),

    updateById: co.wrap(function*(id, data) {
        let Discriminator = Event.discriminators[data.template];
        if (_.isEmpty(Discriminator)) {
            throw new Error('未知的模版信息');
        }
        let event = yield Discriminator.findById(id).exec();
        if (!event) {
            throw createError(400, '活动不存在');
        }
        _.assign(event, _.omit(data, '_id', 'enroll', 'template', 'schoolId'));
        return yield event.save();
    }),

    //添加任务
    addTask: co.wrap(function*(id, data) {
        let event = yield Event.findById(id).select('_id task schoolId').exec();
        if (!event) {
            throw createError(400, '活动不存在')
        }
        if (event.task) {
            throw createError(400, '任务已经存在,请先删除');
        }
        let task = new ScoreTask(data);
        task.schoolId = event.schoolId;
        yield task.save();
        event.task = task;
        return yield event.save();
    })
};


function needEnroll(template) {
    return _.indexOf(['activity', 'audition'], template) !== -1;
}


