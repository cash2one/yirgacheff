/**
 * Created by Admin on 2016/1/9.
 */
'use strict';
require('../../../common/formvalidator');
var app = require('../../../common/app');
var upload = require('../../../common/uploadifive');
var richEditor = require('../../../common/richEditor');
var WXEditor = require('../../../components/weixinEditor/Editor');
var Vue = require('vue');

$(document).ready(function () {
    app();
    //富编辑器渲染
    var editor = richEditor.render('content');
    var vm = new Vue({
        el: '#auditionApp',
        data: {
            enrollFields: [],
            loading: false
        },
        components: {
            'enroll': require('../../../components/enroll'),
            'wx-editor': WXEditor
        },
        methods: {
            uiSelect: function (ui) {
                editor.execCommand('insertHtml', ui);
            }
        }
    });


    //初始化微信编辑器
    editor.ready(function () {
        var hideContent = $("#hideContent");
        if (hideContent.length > 0) {
            editor.setContent(hideContent.val());
        }
    });

    //本地上传
    upload({
        file: 'photoUpload',
        done: function (file) {
            $('#photoView').attr('src', file.path);
            $('#teacherPhoto').val(file.key);
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

    $("#auditionForm").validate(function ($form, data) {
        if (!editor.hasContents()) {
            return app.notify.danger("请填写试听课内容")
        }
        data.template = 'audition';
        data.enrollFields = vm.enrollFields;
        vm.loading = true;
        $.post('/api/v1/events', data).then(function (event) {
            self.location.href = "/school/events/manage/" + event._id.toString();
        });
    });

});