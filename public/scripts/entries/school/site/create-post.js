'use strict';

require('../../../common/formvalidator');
var app = require('../../../common/app');
var notify = require('../../../common/notify');
var upload = require('../../../common/uploadifive');
var richEditor = require('../../../common/richEditor');
var WXEditor = require('../../../components/weixinEditor/Editor');
var Vue = require('vue');
$(document).ready(function () {
    app();

    //富编辑器渲染
    var editor = richEditor.render('content');
    new Vue({
        el: '#postApp',
        components: {
            'wx-editor': WXEditor
        },
        methods: {
            uiSelect: function (ui) {
                editor.execCommand('insertHtml', ui);
            }
        }
    });
    editor.ready(function () {
        editor.setContent($("#postContent").val());
    });

    //本地上传
    upload({
        file: 'imageUpload',
        done: function (file) {
            $('#indexImage').attr('src', file.path);
            $('#coverImage').val(file.key);
        }
    });

    //文章发布
    $("#postForm").validate(function ($form, data) {
        if (!editor.hasContents()) {
            return notify.danger("请填写文章内容")
        }
        $.post('/api/v1/posts', data).then(function () {
            self.location.href = "/school/posts/";
        });
    });


});