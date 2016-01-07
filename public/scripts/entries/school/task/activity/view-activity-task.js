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
        editor.setContent($("#taskContent").val());
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

    //提交
    $("#activityForm").validate(function ($form, data) {
        if (!editor.hasContents()) {
            return notify.danger("请填写文章内容")
        }
        var taskId = $('#taskId').val();
        $.ajax({
            url:'/api/v1/tasks/'+ taskId,
                method:'PUT',
            data:data
        }).then(function(){
            self.location.href = "/school/tasks"
        });
    });


    //处理[报名信息]展示与隐藏
    $('.registration-elem').each(function () {
        $(this).find('li').eq(0).bind('click', function () {
            //判断
            var judge = $(this).next().is(":hidden");
            if (judge) {
                $(this).siblings().show();
            } else {
                $(this).siblings().hide();
            }

        });
    });

    function tips() {
        notify.warning("无法修改报名信息!")
    }
    //添加附加信息
    $(".enrollarea").on("click",".enroll-field-btn", function() {
        tips();
    });
    $(".enrollarea").on("click",".enroll-field-custom", function() {
        tips();
    });

});

