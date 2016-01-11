/**
 * Created by Frank on 16/1/11.
 */
'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;


var enrollFormSchema = new mongoose.Schema({
    // 对应活动
    event: {
        type: ObjectId
    },

    // 报名自定义域
    fields: [{
        inputType: {
            type: String,
            default: 'text'
        },
        label: String
    }],

    //报名信息
    enrolls: [[String]],

    schoolId: {
        type: ObjectId,
        required: true
    }
});


mongoose.model('EnrollForm', enrollFormSchema);