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

    countBySchool: co.wrap(function*(schoolId, template) {
        let query = {schoolId: schoolId};
        if (template && template !== 'all') {
            query.template = template;
        }
        return yield Event.count(query).exec();
    }),

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
        event.tags = [];
        //是否需要报名
        if (needEnroll(template)) {
            enroll = new Enroll({schoolId: creator.schoolId});
            if (data.enrollFields) {
                enroll.fields = [];
                _.forEach(data.enrollFields, field => {
                    let label = field.label;
                    if (label && label.trim() !== "") {
                        enroll.fields.push({label: label, inputType: 'text'});
                    }
                });
            }
            enroll.event = event;
            yield enroll.save();
            event.enroll = enroll;
            event.tags.addToSet('报名');
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


    // 添加任务
    addTask: co.wrap(function*(eventId, data) {
        let event = yield Event.findById(eventId).select('_id schoolId tags').exec();
        if (!event) {
            throw createError(400, '活动不存在')
        }
        let task = new ScoreTask(data);
        task.schoolId = event.schoolId;
        task.event = event;
        event.tags.addToSet('任务');
        return yield task.save();
    }),

    // 删除任务
    deleteTask: co.wrap(function*(eventId, taskId) {
        let task = yield ScoreTask.findById(taskId).exec();
        if (!task) {
            throw createError(400, '任务不存在');
        }
        yield task.remove();
        let count = yield ScoreTask.count({event: eventId}).exec();
        if (count === 0) {
            yield Event.update({_id: eventId}, {$pull: {tags: '任务'}}).exec();
        }
        return true;
    }),

    // 更新任务
    updateTaskById: co.wrap(function*(taskId, data) {
        data = _.omit(data, '_id');
        let task = yield ScoreTask.findById(taskId).exec();
        if (!task || task.state === 1) {
            throw createError(400, '任务不存在或已关闭');
        }
        _.assign(task, data);
        return yield task.save();
    }),

    //开启任务
    openTaskById: co.wrap(function*(taskId) {
        let task = yield ScoreTask.findById(taskId).exec();
        if (!task || task.state === 0) {
            throw createError(400, '任务不存在或已经开启');
        }
        task.state = 0;
        return yield task.save();
    }),


    //关闭任务
    closeTaskById: co.wrap(function*(taskId) {
        let task = yield ScoreTask.findById(taskId).exec();
        if (!task || task.state === 1) {
            throw createError(400, '任务不存在或已关闭');
        }
        task.state = 1;
        return yield task.save();
    }),

    getTasksByEvent: co.wrap(function*(eventId) {
        return yield ScoreTask.find({event: eventId}).lean().exec();
    })

};


function needEnroll(template) {
    return _.indexOf(['activity', 'audition'], template) !== -1;
}


