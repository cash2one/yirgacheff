/**
 * Created by Frank on 16/1/11.
 */
'use strict';

const mongoose = require('mongoose');
const Event = mongoose.model('Event');

//投票数据模型
const voteSchema = new mongoose.Schema({

    // 排行榜人数
    rank: {
        type: Number,
        required: true,
        default: 50
    },

    // 开始时间
    startTime: {
        type: Date,
    },

    // 截止日期
    endTime: {
        type: Date
    },
 
    // 首页滑动图片
    slides: [String],

    // 颜色主题 
    theme: {
        type: String,
        default: 'default'
    },

    // 每人投票数量限制 
    voteLimit: {
        type: Number,
        default: 3
    },

    // 是否要求关注
    requireFollow: {
        type: Boolean,
        default: true
    },

    // 关注提示
    followTip: {
        type: String
    },

    // 奖项设置
    prize: {
        type: String
    },

    // 参与方式
    participation: {
        type: String
    },
    
    // 投票说明
    explanation: {
        type: String
    }

});

voteSchema.post('remove', (vote) => {


});

module.exports = voteSchema;