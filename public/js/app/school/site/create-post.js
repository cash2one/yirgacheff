'use strict';
requirejs(['jquery', 'leftMenu', 'headMenu', 'layerWrapper', 'upload', 'imageLibrary', 'richEditor', 'easyDropDown'],
    function ($, leftMenu, headMenu, layer, upload, imgLib, richEditor) {
        leftMenu.init();
        headMenu.init();

        // 富编辑器渲染
        richEditor.render('postContent');

        // 本地上传
        upload.imgUploader({
            onComplete: function (file, done) {
                $('.coverpage img').attr('src', file.url);
                $('#coverImage').val(file.key);
                done();
            }
        });

        // 图库上传
        imgLib.selectBind({
            bindButton: 'chooseFromLibrary',
            onSelected: function (keys) {
                if (keys.length === 0) {
                    return;
                }
                var key = keys[0];
                $('.coverpage img').attr('src', 'http://resource.hizuoye.com/' + key);
                $('#coverImage').val(key);
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
            var content = $('#postContent').val();
            if (content.trim() === '') {
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
    });
