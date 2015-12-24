/**
 * Created by Frank on 15/12/22.
 */
'use strict';

const mongoose = require('mongoose');
const co = require('co');

const ActivityCollect = mongoose.model('ActivityCollect');
const Task = mongoose.model('Task');
const Activity = mongoose.model('Activity');

module.exports = {


    getEnrolls: co.wrap(function*(activityId) {
        return yield ActivityCollect.find({
            activity: activityId
        }).lean().exec();

    })

};