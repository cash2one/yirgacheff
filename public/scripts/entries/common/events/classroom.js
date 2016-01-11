/**
 * Created by Admin on 2016/1/10.
 */
'use strict';
require('../../../common/formvalidator');
var app = require('../../../common/app');
var notify = require('../../../common/notify');
var upload = require('../../../common/uploadifive');
var richEditor = require('../../../common/richEditor');
var weixinEditor = require('../../../common/weixinEditor');

$(document).ready(function () {
    app();

    //富编辑器渲染
    var editor = richEditor.render('content');
    //初始化微信编辑器
    weixinEditor({editor: editor});

    upload({
        file: 'imageUpload',
        done: function (file) {
            $('#indexImage').attr('src', file.path);
            $('#coverImage').val(file.key);
        }
    });

});