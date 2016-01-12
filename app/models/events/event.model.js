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
        required: '标题不能为空'
    },

    // 封面图片
    coverImage: {
        type: String,
        required: '封面不能为空'
    },

    // 详情
    content: {
        type: String
    },

    // 报名表单 (如果存在说明需要报名,否则不需要)
    enroll: {
        type: ObjectId
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

    //创建人
    creator: {
        type: ObjectId,
        required: '创建人不能为空'
    },

    state: {
        type: Number,
        default: 0
    },

    //创建人角色
    creatorRole: {
        type: Number,
        required: '创建人角色不能为空'
    },

    //模版类型
    template: {
        type: String,
        required: '模版不能为空',
        enum: ['article']
    },

    schoolId: {
        type: ObjectId,
        required: true
    },

    createdTime: {
        type: Date,
        default: Date.now
    }

});

const Event = mongoose.model('Event', eventSchema);

Event.discriminator('Activity', require('./themes/activity.model'));
Event.discriminator('Article', require('./themes/article.model'));
Event.discriminator('Audition', require('./themes/audition.model'));
