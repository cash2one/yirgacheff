/**
 * Created by Admin on 2016/1/10.
 */
'use strict';
require('../../../common/formvalidator');
var app = require('../../../common/app');
var notify = require('../../../common/notify');
var upload = require('../../../common/uploadifive');

$(document).ready(function () {
    app();

    var $videoList =$(".video-list");

    upload({
        file: 'imageUpload',
        done: function (file) {
            $('#indexImage').attr('src', file.path);
            $('#coverImage').val(file.key);
        }
    });

    $("#uploadVideo").on('click', '.upload', function () {
        $("#addVideoModal").modal('show');
    });

    $("#addVideoForm").validate(function () {
        var link = $("#link").val();
        var name = $("#videoName").val();
        var detail =$("#videoDetail").val();
        var video = "<div class='col-xs-4 video-item'><div class='thumbnail'>" +
            "<div class='video-container'>"+ link +"</div><div class='caption'>" +
            "<p class='video-title'>"+ name +"</p><div class='video-control'>" +
            "<a class='f-info m-r-xs'>修改</a><a class='f-pink delete-video'>删除</a></div>" +
            "<p class='video-detail'>"+ detail +"</p></div></div></div>";
        $("#uploadVideo").before(video);
        $("#addVideoModal").modal('hide');
        notify.success("添加成功");
        $("#addVideoForm")[0].reset();
    });

    //重新上传
    $videoList.on('click', '.reset-video', function () {
        var link = $(this).closest('.video-item').find('.video-container').html();
        var name = $(this).closest('.video-item').find('.video-title').html();
        var detail = $(this).closest('.video-item').find('.video-detail').html();
        console.log(link,name,detail)
    });

    //删除视频
    $videoList.on('click', '.delete-video', function () {
        $(this).closest('.video-item').remove();
        notify.danger("删除成功");
    });

});