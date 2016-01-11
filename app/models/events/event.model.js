/**
 * Created by Frank on 16/1/11.
 */
'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const eventSchema = new Schema({

    // 标题
    title: {
        type: String,
        required: true
    },

    // 封面图片
    coverImage: {
        type: String,
        required: true
    },

    // 详情
    content: {
        type: String
    },

    // 是否需要报名
    needEnroll: {
        type: Boolean,
        default: false
    },

    // 阅读量
    visitCount: {
        type: Number,
        default: 0
    },

    // 赞
    like: {
        type: Number,
        default: 0
    },

    // 分享量
    shareCount: {
        type: Number,
        default: 0
    },

    schoolId: {
        type: ObjectId,
        required: true
    },

    createdTime: {
        type: Date
    }

});


mongoose.model('Event', eventSchema);

