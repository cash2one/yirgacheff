'use strict';

require('../../../../common/formvalidator');
var app = require('../../../../common/app');
var datepicker = require('../../../../common/datetimepicker');
var notify = require('../../../../common/notify');
var upload = require('../../../../common/uploadifive');
var richEditor = require('../../../../common/richEditor');
var weixinEditor = require('../../../../common/weixinEditor');

$(document).ready(function () {
    app();

    //富编辑器渲染
    var editor = richEditor.render('content');
    //初始化微信编辑器
    weixinEditor({editor: editor});
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

    datepicker.timeRange({
        start: 'startTime',
        end: 'endTime'
    });

    $("#activityForm").validate(function ($form, data) {
        if (!editor.hasContents()) {
            return notify.danger("请填写文章内容")
        }
        console.log(data);
        $.post('/api/v1/tasks/activity', data).then(function (data) {
            self.location.href = "/school/tasks"
        });
    });
    //添加附加信息
    $(".enroll-field-btn").click(function() {
        var label = $(this).text().trim();
        var field = "<div class='form-group enroll-field'><label class='control-label col-xs-2'>" + label + "：</label> <div class='col-xs-10'><input class='form-control' type='text' name='infoCollect' value='" + label + "' placeholder='请输入你的" + label + "'><i class='delete fa fa-times f-gray f-s-16 pull-right m-t-n-lg m-r-xs'></i></div></div>";
        $('.enroll-extras').append(field);
    });
    //添加自定义
    $(".enroll-field-custom").click(function() {
        var info = $(this).text().trim();
        var field = "<div class='form-group enroll-field'>\n   " +
            "<div class='col-xs-2'><input class='form-control validate' name='infoCollect' data-rules='required'  placeholder='" + info + "'>\n\n </div>\n   " +
            "<div class='col-xs-10'>" +
            "<input class='form-control' type='text' placeholder='请输入" + info + "信息" + "'>" +
            "<i class='delete fa fa-times f-gray f-s-16 pull-right m-t-n-lg m-r-xs'></i> " +
            "</div>\n</div>";
        $('.enroll-extras').append(field);
    });
    $(".enroll-extras").on('click',".delete", function() {
        $(this).closest(".enroll-field").remove();
    });
});

