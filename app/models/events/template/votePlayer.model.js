'use strict';
const mongoose = require('mongoose');
const ObjectId = Schema.Types.ObjectId;


//投票选手数据模型
const voteLogSchema = new mongoose.Schema({

	// 对应投票ID
	vote: {
		type: ObjectId,
		required: true
	},

	// 选手编号
	uid: {
		type: String,
		required: true
	},

	// 选手姓名
	name: {
		type: String,
	},

	// 电话
	phone: {
		type: String
	},
  
  // 封面
	cover:{
		type:String
	},

  // 图片列表
	gallery:[String],


	// 选手简介
	brief: {
		type: String
	},

	// 票数
	poll: {
		type: Number,
		default: 0
	},

  // 创建日期
	createdTime: {
		type: Date,
		default: Date.now,
	}

});