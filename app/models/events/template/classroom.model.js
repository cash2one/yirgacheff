/**
 * Created by Frank on 16/1/11.
 */
'use strict';

const mongoose = require('mongoose');
const Event = mongoose.model('Event');

//试听课邀请
const classroomSchema = new mongoose.Schema({

    //课程简介
    courseBrief: {
        type: String,
        required: true
    },

    //课程列表
    courses: [{

        id: {
            type: Number,
            required: true
        },

        title: {
            type: String,
            required: true
        },

        url: {
            type: String,
            required: true
        },

        visit: {
            type: Number,
            default: 0
        },

        share: {
            type: Number,
            default: 0
        },

        like: {
            type: Number,
            default: 0
        }
    }]

});

module.exports = classroomSchema;
