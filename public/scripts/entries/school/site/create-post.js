'use strict';

var app = require('../../../common/app');
var layer = require('../../../common/layerWrapper');
var imgLib = require('../../../common/imageLibrary');
var upload = require('../../../common/uploadifive');
var richEditor = require('../../../common/richEditor');

$(document).ready(function () {
    app();

    //富编辑器渲染
    richEditor.render('postContent');

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
            $('#content').val(editor.getContent());
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


});
