'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;


//投票纪录数据模型，每条纪录保持一天后会被删除
const playerSchema = new Schema({

	// 对应投票ID
	vote: {
		type: ObjectId,
		required: true
	},

	// 参与人唯一标识
	uid: {
		type: String,
		required: true
	},

	// 姓名
	name: {
		type: String,
		required: true
	},


	// 作品
	images: [String],

	// 简介
	brief: {
		type: String
	},

	// 票数
	poll: {
		type: Number,
		default: 0
	},

	// 来源 
	source: {
		type: String,
		required: true
	},

	createdTime: {
		type: Date,
		default: Date.now
	}

});

mongoose.model('VotePlayer', playerSchema);