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
    var editor = richEditor.render('postContent');

    //初始化微信编辑器
    weixinEditor({
        callback: function (content) {
            editor.setValue("<div>" + content + "</div><br />");
        }
    });

    //本地上传
    upload({
        file: 'imageUpload',
        done: function (file) {
            $('#indexImage').attr('src', file.path);
            $('#coverImage').val(file.key);
        }
    });

    //图库上传
    upload({
        button: 'uploadButton',
        multi: true,
        done: function (queue) {
            console.log(queue.length);
        }
    });

    //文章发布
    $("#postForm").validate(function ($form, data) {
        if (!editor.getValue()) {
            return notify.danger("请填写文章内容")
        }
        $.post('/api/v1/posts', data).then(function (data) {
            self.location.href = "/school/posts/" + data._id.toString();
        });
    });

});