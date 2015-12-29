'use strict';

var app = require('../../../common/app');
var layer = require('../../../common/layerWrapper');
var upload = require('../../../common/uploadifive');
var richEditor = require('../../../common/richEditor');

$(document).ready(function () {
    app();

    //富编辑器渲染
    var editor = richEditor.render('postContent');

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

    function validate() {
        var coverImage = $('#coverImage').val();
        if (coverImage.trim() === '') {
            layer.msg('封面图片不能为空');
            return false;
        }
        var title = $('#postTitle').val();
        if (title.trim() === '') {
            layer.msg('文章标题不能为空');
            return false;
        }
        var category = $('#category').val();
        if (category === '') {
            layer.msg('栏目不能为空');
            return false;
        }
        if (!editor.hasContents()) {
            layer.msg('文章内容不能为空');
            return false;
        }
        var visitCount = $('#visitCount').val();
        if (isNaN(visitCount)) {
            layer.msg('阅读量必须为数字');
            return false;
        }
        var shareCount = $('#shareCount').val();
        if (isNaN(shareCount)) {
            layer.msg('分享量必须为数字');
            return false;
        }
        var like = $('#like').val();
        if (isNaN(like)) {
            layer.msg('点赞量必须为数字');
            return false;
        }
        return true;
    }

//文章发布
    $('#savePost').click(function () {
        if (validate()) {
            var postId = $('#postId').val();
            var action = '';
            if (postId && postId !== '') {
                action = '/school/posts/' + postId + '/update';
            } else {
                action = '/school/posts/create'
            }
            $('#postForm').attr('action', action).submit();
        }
    });

    //颜色修改
    $(".colorpick").on("click","li", function(event) {
        var colorValue = $(this).css('background-color');
        event.stopPropagation();
        $(this).closest(".dropdown").find('.bg-color').css('background-color',colorValue);
        $(".itembox .wxqq-bg").css({
            backgroundColor: colorValue
        });
        $(".itembox .wxqq-color").css({
            color: colorValue
        });
        var border = ["borderTopColor", "borderRightColor", "borderBottomColor", "borderLeftColor"],
            className = [];
        $.each(border,
            function(a) {
                className.push(".itembox .wxqq-" + border[a])
        });
        $.each(className,
            function(position) {
                $(className[position]).css(border[position],colorValue)
        })
    });

    //内容插入
    $("#gallery").on('click','.item', function () {
        console.log($(this).html());
        editor.execCommand("insertHtml", "<div>" + $(this).html() + "</div><br />")
    });
    $("#tab1").on("click",".item", function() {
        editor.execCommand("insertHtml", "<div>" + $(this).html() + "</div><br />")
    });

});
