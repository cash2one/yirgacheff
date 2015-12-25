/**
 * Created by Frank on 15/12/22.
 */
'use strict';
const mongoose = require('mongoose');
const co = require('co');
const _ = require('lodash');
const createError = require('http-errors');
const queryBuilder = require('../../functions/queryBuilder');

const Task = mongoose.model('Task');
const Activity = mongoose.model('Activity');

module.exports = {

    findBySchool: co.wrap(function*(schoolId, filter) {
        let query = Task.find({
            schoolId: schoolId
        }).where('state').ne(2);

        if (!_.isEmpty(filter)) {
            queryBuilder(query, filter);
        }

        return yield query.lean().exec();

    }),

    findById: co.wrap(function*(id) {
        let task = yield Task.findById(id).exec();
        if (!task) {
            throw createError(400, '任务不存在');
        }
        switch (task.taskType) {
            case 0:
                return yield task.populate({
                    path: 'item',
                    model: 'Post',
                    select: '-content'
                }).execPopulate();

            case 1:
                return yield task.populate({
                    path: 'item',
                    model: 'Activity'
                }).execPopulate();

            default:
                return task;
        }
    }),


    createPostTask: co.wrap(function*(schoolId, data) {
        let task = new Task(data);
        task.taskType = 0;
        task.schoolId = schoolId;
        return yield task.save();
    }),


    createActivityTask: co.wrap(function*(schoolId, data) {
        let activity = new Activity(data);
        let task = new Task(data);
        yield activity.save();
        task.item = activity;
        task.taskType = 1;
        task.schoolId = schoolId;
        try {
            yield task.save();
        } catch (err) {
            yield activity.remove();
            throw err;
        }
        return task;
    }),

    closeTaskById: co.wrap(function*(id) {
        let task = yield Task.findById(id).exec();
        if (!task) {
            throw createError(400, '任务不存在');
        }
        task.state = 1;
        return yield task.save();
    }),

    updateTaskById: co.wrap(function*(id, data) {
        let task = yield Task.findById(id).exec();
        if (task.state === 1) {
            throw createError(400, '任务已经关闭,无法修改');
        }
        _.assign(task, data);
        yield task.save();
        if (task.taskType === 1) {
            yield Activity.update({_id: task.item}, data).exec();
        }
        return task;
    })

};

