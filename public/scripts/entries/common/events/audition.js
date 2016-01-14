/**
 * Created by Admin on 2016/1/9.
 */
'use strict';

require('../../../common/formvalidator');
var app = require('../../../common/app');
var upload = require('../../../common/uploadifive');
var richEditor = require('../../../common/richEditor');
var weixinEditor = require('../../../common/weixinEditor');
var Vue = require('vue');

$(document).ready(function () {
    app();
    var vm = new Vue({
        data: {
            enrollFields: []
        },
        components: {
            'enroll': require('../../../components/enroll')
        },
        el: '#auditionApp'
    });

    //富编辑器渲染
    var editor = richEditor.render('content');
    //初始化微信编辑器
    weixinEditor({editor: editor});
    //本地上传
    upload({
        file: 'imageUpload',
        done: function (file) {
            $('#indexImage').attr('src', file.path);
            $('#coverImage').val(file.key);
        }
    });

});