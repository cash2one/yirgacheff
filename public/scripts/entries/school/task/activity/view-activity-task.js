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
    //
    ////添加信息栏
    //$('#add-title-info').click(function () {
    //    var size = $('#title-info-list').find('li').size();
    //    if (size > 5) {
    //        layer.msg('最多只能设置 5 项报名信息');
    //        return false;
    //    }
    //
    //    layer.open({
    //        title: '报名信息',
    //        contentId: 'add-title-info-dialog',
    //        okCallback: function (index) {
    //            var infoName = $('#titleInfoName').val();
    //            if (!infoName || infoName.trim() === '') {
    //                layer.msg('信息名称不能为空');
    //                return;
    //            }
    //            var li_content = '<li class="item">' + infoName +
    //                '<input type="hidden" name="infoCollect" value="' + infoName + '">' +
    //                '<i class="fa fa-times deleteInfo"></i></li>';
    //            $('#add-title-info').before(li_content);
    //            layer.close(index);
    //        }
    //    });
    //});
    //$('#infoList').on('click', '.deleteInfo', function () {
    //    $(this).closest('li').remove();
    //});
    //
    ////保存
    //$('#activity-share-save').click(function () {
    //    var name = $('#name').val();
    //    if (isEmpty(name)) {
    //        layer.msg('任务名称不能为空');
    //        return;
    //    }
    //    var scoreAward = $('#scoreAward').val();
    //    if (isEmpty(scoreAward)) {
    //        layer.msg('奖励积分不能为空');
    //        return;
    //    }
    //    if (!scoreAward.match('^[1-9][0-9]*$')) {
    //        layer.msg('积分必须为数字');
    //        return;
    //    }
    //    var theme = $('#theme').val();
    //    if (isEmpty(theme)) {
    //        layer.msg('活动主题不能为空');
    //        return;
    //    }
    //    var s_date = $('#date-picker-start').val();
    //    if (isEmpty(s_date)) {
    //        layer.msg('开始时间不能为空');
    //        return;
    //    }
    //    var e_date = $('#date-picker-end').val();
    //    if (isEmpty(e_date)) {
    //        layer.msg('结束时间不能为空');
    //        return;
    //    }
    //    var location = $('#activity-location').val();
    //    if (isEmpty(location)) {
    //        layer.msg('活动地点不能为空');
    //        return;
    //    }
    //    var content = $('#activity-detail').val();
    //    if (isEmpty(content)) {
    //        layer.msg('活动详情不能为空');
    //        return;
    //    }
    //    var taskId = $('#taskId').val();
    //    var infoCollect = [];
    //    $('input[name="infoCollect"]').each(function () {
    //        infoCollect.push($(this).val());
    //    });
    //    $http.put('/api/v1/tasks/' + taskId, {
    //        name: name,
    //        scoreAward: scoreAward,
    //        theme: theme,
    //        startTime: s_date,
    //        endTime: e_date,
    //        address: location,
    //        content: content,
    //        infoCollect: infoCollect
    //    }, function () {
    //        layer.msg('修改成功');
    //    });
    //});
    //
    //function isEmpty(parameter) {
    //    return !parameter || parameter === '';
    //}

    //提交
    $("#activityForm").validate(function ($form, data) {
        if (!editor.hasContents()) {
            return notify.danger("请填写文章内容")
        }
        //$.post('/api/v1/tasks', data).then(function (data) {
        //    self.location.href = "/school/tasks/" + data._id.toString();
        //});
    });

    //处理Tab
    $('.w-base-switch').find('li').each(function (index) {
        $(this).bind('click', function () {
            var active = $(this).hasClass('active');
            if (!active) {
                $(this).addClass('active').siblings().removeClass('active');
            }
            $('.management-console').find('li.management-item').eq(index).show().siblings().hide();
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

