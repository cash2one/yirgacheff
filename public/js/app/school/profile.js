'use strict';


requirejs(['jquery', 'restfulClient', 'leftMenu', 'headMenu', 'layerWrapper', 'upload', 'darktooltip', 'jqueryExt'],
    function ($, $http, leftMenu, headMenu, layer, upload) {
        leftMenu.init();
        headMenu.init();
        upload.imgUploader({
            onComplete: function (file, done) {
                $('img.avatar').attr('src', file.url);
                var url = '/api/v1/schools/' + user._id.toString() + '?me=true';
                $http.put(url, {avatar: file.key}, function () {
                    layer.msg('修改头像成功!');
                    $('#local_image_upload').show();
                    $('#savePic').hide();
                    done();
                }, function () {
                    done();
                });
            }
        });

        //信息修改
        $('#info-save-btn').click(function () {
            var data = $('#infoForm').serializeObject();
            if (data.displayName === '') {
                layer.msg('姓名不能为空');
                return;
            }
            if (data.contact === '') {
                layer.msg('联系方式不能为空');
                return;
            }
            var url = '/api/v1/schools/' + user._id.toString() + '?me=true';
            $http.put(url, data, function () {
                layer.msg('修改信息成功');
            });
        });

        //修改密码
        $('#change-psw-btn').click(function () {
            var data = $('#passwordForm').serializeObject();
            if (data.password === '') {
                layer.msg('原始密码不能为空');
                return;
            }
            if (data.newPassword === '') {
                layer.msg('新密码不能为空');
                return;
            }
            if (data.newPassword !== data.confirmPassword) {
                layer.msg('两次密码输入不一致');
                return;
            }
            var url = '/api/v1/auth/modifyPassword';
            $http.put(url, data, function () {
                layer.msg('修改密码成功!');
            });
        });

        //提示
        $('.dark-tip-show').darkTooltip({
            gravity: 'west'
        });

    });
