/**
 * Created by Frank on 16/1/11.
 */
'use strict';

const mongoose = require('mongoose');
const Event = mongoose.model('Event');

//试听课邀请
const auditionSchema = new mongoose.Schema({


    //主讲老师
    teacher: {
        type: String,
        required: true
    },

    teacherPhoto: {
        type: String
    },

    //主讲老师介绍
    teacherProfile: {
        type: String
    },

    // 开课时间
    startTime: {
        type: String,
        required: true
    },

    // 上课地点
    address: {
        type: String,
        required: true
    }
});

module.exports = auditionSchema;
