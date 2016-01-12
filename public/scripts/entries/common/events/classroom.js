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

    var $videoItem =$(".video-item");

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
        var video = "<div class='media b m-b-md'>" +
            "<div class='media-left video-container'>"+ link +"</div>" +
            "<div class='media-body'><p class='video-title'>"+ name +"</p>" +
            "<div class='video-control'><a class='f-info m-r-xs reset-video'>重新上传</a><a class='f-pink delete-video'>删除</a></div>" +
            "<p class='video-detail'>"+ detail +"</p></div></div>";
        $(".video-item").append(video);
        $("#addVideoModal").modal('hide');
        notify.success("添加成功");
        $("#addVideoForm")[0].reset();
    });

    //重新上传
    $videoItem.on('click', '.reset-video', function () {
        var link = $(this).closest('.media').find('.video-container').html();
        var name = $(this).closest('.media').find('.video-title').html();
        var detail = $(this).closest('.media').find('.video-detail').html();
        console.log(link,name,detail)
    });

    //删除视频
    $videoItem.on('click', '.delete-video', function () {
        $(this).closest('.media').remove();
        notify.danger("删除成功");
    });

});