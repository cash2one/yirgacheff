/**
 *
 * Created by Frank on 15/8/4.
 */
define(['jquery', 'restfulClient', 'layerWrapper', 'upload'],
    function ($, $http, layer, upload) {
        var cache = {};
        upload.imgUploader({
            browseButton: 'local_image_upload_lib',
            multi: true,
            onComplete: function (files, done) {
                var selectedGroup = $('dd.selected a');
                var groupId = selectedGroup.attr('id');
                var length = files.length;
                var uploads = [];
                for (var i = 0; i < length; i++) {
                    var file = files[i];
                    uploads.push({key: file.key, name: file.name});
                }
                $http.post('/api/v1/medias', {uploads: uploads, group: groupId}, function (data) {
                    delete cache[groupId];
                    selectedGroup.trigger('click');
                    refreshMediaCount();
                    layer.msg('成功上传图片 (' + uploads.length + ') 张');
                    done();
                }, function (err) {
                    done();
                });
            }
        });

        //获取素材分类下每个分类的图片详细信息
        function getMediaDetailInfo(groupId) {
            if (cache[groupId]) {
                $('#img_list').html(cache[groupId]);
                return;
            }
            var content = '';
            $http.get('/api/v1/mediaGroups/' + groupId + '/medias', function (data) {
                for (var i = 0; i < data.length; i++) {
                    var media = data[i];
                    content += '<li class="img_item js_imageitem" >' +
                        '<label class="frm_checkbox_label img_item_bd" id="' + media.key + '">' +
                        '<img alt="' + media.name +
                        '" class="pic" src="http://resource.hizuoye.com/' + media.key + '">' +
                        '<span class="lbl_content_ext">' + media.name + '</span>' +
                        '<div class="selected_mask">' +
                        '<div class="selected_mask_inner"></div>' +
                        '<div class="selected_mask_icon"></div>' +
                        '</div>' +
                        '</label>' +
                        '</li>';
                }
                $('#img_list').html(content);
                cache[groupId] = content;
            });
        }

        //初始化图库
        (function () {
            $http.get('/api/v1/mediaGroups', function (groups) {
                var html = '';
                for (var i = 0; i < groups.length; i++) {
                    var group = groups[i];
                    html += '<dd class="inner_menu_item js_groupitem ';
                    if (i === 0) {
                        html += 'selected';
                    }
                    html += '" >';
                    html += '<a href="javascript:void(0);" class="inner_menu_link" ';
                    html += 'title="' + group.name + '"';
                    html += 'id="' + group._id + '"';
                    html += '>';
                    html += '<strong>' + group.name + '</strong>';
                    html += '<em class="num">(<span>0</span>)</em>';
                    html += '</a></dd>';
                }
                $('#mediaGroup').html(html);
                getMediaDetailInfo('unGroup');
                refreshMediaCount();
            });
        })();

        $('#mediaGroup').on('click', '.inner_menu_link', function () {
            getMediaDetailInfo($(this).attr('id'));
            $('dd').removeClass('selected');
            $(this).closest('dd').addClass('selected');
        });


        $('#img_list').on('click', '.frm_checkbox_label', function () {
            $(this).toggleClass('selected');
        });

        function selectBind(ops) {
            var bindId = '#' + ops.bindButton;
            $(bindId).click(function () {
                selectCallback(ops);
            });
        }

        function selectCallback(ops) {
            var multi = ops.multi || false;
            var onSelected = ops.onSelected;
            $('.frm_checkbox_label').removeClass('selected');
            layer.open({
                contentId: 'imageLibrary',
                okCallback: function () {
                    var keys = [];
                    $('#img_list').find('.selected').each(function (index, elem) {
                        keys.push($(elem).attr('id'));
                    });
                    if (!multi && keys.length > 1) {
                        layer.msg('只能选择一张图片');
                        keys = [];
                        return;
                    }
                    if (onSelected && typeof onSelected === 'function') {
                        onSelected(keys);
                    }
                    layer.closeAll();
                }
            });
        }

        //获取素材分类下每个分类的图片数量
        function refreshMediaCount() {
            $http.get('/api/v1/mediaGroups/medias/count', function (groupMapper) {
                $('.inner_menu_link').each(function () {
                    var groupId = $(this).attr('id');
                    var count = groupMapper[groupId] || 0;
                    $(this).find('em >span').html(count);
                });
            });
        }

        return {
            selectBind: selectBind,
            selectCallback: selectCallback
        };
    });
