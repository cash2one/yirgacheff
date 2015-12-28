/**
 * Created by Frank on 15/6/5.
 */
'use strict';

var _ = require('underscore');
var app = require('../../../common/app');
var layer = require('../../../common/layerWrapper');
var $http = require('../../../common/restfulClient');

$(document).ready(function () {

    //upload.imgUploader({
    //    multi: true,
    //    onComplete: function (files, done) {
    //        var length = files.length;
    //        var group = $('.select-item.checked a').attr('id');
    //        var uploads = [];
    //        for (var i = 0; i < length; i++) {
    //            var file = files[i];
    //            uploads.push({key: file.key, name: file.name});
    //        }
    //        $http.post('/api/v1/medias', {uploads: uploads, group: group}, function () {
    //            $('.select-item.checked').trigger('click');
    //            layer.msg('成功上传图片 (' + length + ') 张');
    //            refreshMediaCount();
    //            done();
    //        }, function () {
    //            done();
    //        })
    //    }
    //});

    var mediasTemplate = _.template($("#mediaListTemplate").html());
    var mediaList = $('#mediaList');
    var allChecked = $('#all_checkbox');
    //提示信息
    refreshMediaCount();

    //新建分组
    $('.add-new-category').click(function () {
        layer.ajaxForm({
            title: '新建',
            container: 'add-group-dialog',
            form: 'group_form',
            validator: function (data) {
                var name = data.name;
                if (!name || name.trim() === '') {
                    return '分组名不能为空';
                }
            },
            ajax: {
                type: 'POST',
                url: '/api/v1/mediaGroups',
                success: function (data, done) {
                    done();
                    self.location.href = '';
                }
            }
        });
    });

    $('#group-list').on('click', '.select-item', function () {
        $('.select-item').removeClass('checked');
        checkboxUnChecked(allChecked);
        $('#js_move_all, #js_del_all').addClass('btn_disabled');
        $(this).addClass('checked');
        var current = $(this).find('a');
        var url = '/api/v1/mediaGroups/' + current.attr('id') + '/medias';
        $('#currentGroup')
            .html(current.attr('title'))
            .attr('title', current.attr('title'));
        $http.get(url, function (medias) {
            mediaList.html(mediasTemplate({medias: medias}));
            $('.materials-photo-thumb').hover(function () {
                    $('.material-hover-mask', this).show();
                },
                function () {
                    $('.material-hover-mask', this).hide();
                });
        });
    });

    //重命名分组
    $('#rename-group').click(function () {
        var selectItem = $('.select-item.checked a');
        var groupName = selectItem.attr('title');
        var groupId = selectItem.attr('id');
        var $newName = $('#renameGroup');
        $newName.val(groupName);
        layer.ajaxForm({
            title: '修改',
            container: 'edit-group-dialog',
            form: 'edit_group_form',
            validator: function (data) {
                if (groupId === 'unGroup') {
                    return '未分组不能修改名称';
                }
                if (data.name.trim() === '') {
                    return '分组名称不能为空';
                }
                if (data.name.trim() === groupName.trim()) {
                    return '新分组名称没有变化';
                }
            },
            ajax: {
                url: '/api/v1/mediaGroups/' + groupId,
                type: 'PUT',
                success: function (data, done) {
                    selectItem.attr('title', $newName.val());
                    selectItem.find('strong').html($newName.val());
                    done();
                }
            }
        });
    });

    //删除分组
    $('#del-group').click(function () {
        var selectItem = $('.select-item.checked a');
        var groupId = selectItem.attr('id');
        if (groupId === 'unGroup') {
            layer.msg('未分组不能删除');
            return;
        }
        layer.confirm('仅删除分组，不删除图片，组内图片将自动归入未分组', function () {
            var url = '/api/v1/mediaGroups/' + groupId;
            $http.del(url, function () {
                self.location.href = '';
            });
        });
    });

    //全选
    allChecked.click(function () {
        var checked = $(this).is(':checked');
        if (checked) {
            checkboxChecked($(this));
            checkboxChecked($('.img-list').find('.frm_checkbox'));
            if ($('.img-list').find('[checked="checked"]').length === 0) {
                $('#js_move_all, #js_del_all').addClass('btn_disabled');
            }
        } else {
            checkboxUnChecked($(this));
            $('#js_move_all, #js_del_all').addClass('btn_disabled');
            checkboxUnChecked($('.img-list').find('.frm_checkbox'));
        }
    });

    function moveGroup(mediaElements, from) {
        $('#movedGroup').val(from);
        var medias = [];
        mediaElements.each(function () {
            medias.push($(this).attr('id'));
        });
        layer.ajaxForm({
            title: '移动文件',
            container: 'move-dialog',
            validator: function (data) {
                if (data.medias.length === 0) {
                    return '没有需要移动的图片';
                }
                if (data.group === from) {
                    return '分组没有变化';
                }
            },
            ajax: {
                url: '/api/v1/medias/changeGroup',
                type: 'PUT',
                data: function () {
                    return {
                        medias: medias,
                        group: $('#movedGroup').val()
                    };
                },
                success: function (data, done) {
                    refreshMediaCount();
                    mediaElements.remove();
                    done();
                }
            }
        });
    }

    //移动分组
    mediaList.on('click', '.move_gray', function () {
        var medias = $(this).closest('li.img-item');
        var fromGroup = $('.select-item.checked a').attr('id');
        moveGroup(medias, fromGroup);
    });

    //多个文件移动分组
    $('#js_move_all').click(function () {
        if (!$(this).hasClass('btn_disabled')) {
            var fromGroup = $('.select-item.checked a').attr('id');
            var medias = $('.img-list').find('[checked="checked"]').closest('.img-item');
            moveGroup(medias, fromGroup);
        }
    });


    function deleteMedias(mediaElements) {
        var medias = [];
        mediaElements.each(function () {
            medias.push($(this).attr('id'));
        });
        if (medias.length === 0) {
            layer.msg('没有需要删除的文件');
            return;
        }
        layer.confirm('您确定要删除当前所选文件?', function () {
            $http.del('/api/v1/medias', {medias: medias}, function () {
                layer.msg('文件删除成功');
                mediaElements.remove();
                refreshMediaCount();
            });
        });
    }

    //单个文件删除
    mediaList.on('click', '.del_gray', function () {
        var medias = $(this).closest('li.img-item');
        deleteMedias(medias);
    });

    //多个文件删除
    $('#js_del_all').click(function () {
        if (!$(this).hasClass('btn_disabled')) {
            var medias = $('.img-list').find('[checked="checked"]').closest('.img-item');
            deleteMedias(medias);
        }
    });

    //单个复选框处理
    mediaList.on('click', '.frm_checkbox', function () {
        var checked = $(this).is(':checked');
        if (checked) {
            checkboxChecked($(this));
        } else {
            checkboxUnChecked(allChecked);
            checkboxUnChecked($(this));
        }
    });

    //编辑
    mediaList.on('click', '.edit_gray', function () {
        var current = $(this).closest('li.img-item');
        $('#filename').val(current.attr('title'));
        layer.ajaxForm({
            title: '修改',
            container: 'edit-single-file-dialog',
            validator: function (data) {
                if (!data.name || data.name.trim() === '') {
                    return '请输入文件名';
                }
            },
            ajax: {
                url: '/api/v1/medias/changeGroup',
                type: 'PUT',
                data: function () {
                    return {
                        name: $('#filename').val()
                    };
                },
                success: function (data, done) {
                    var newName = $('#filename').val();
                    current.attr('title', newName);
                    current.find('.media-name').html(newName);
                    done();
                }
            }
        });
    });


    $('.select-item.checked').trigger('click');

    //获取素材分类下每个分类的图片数量
    function refreshMediaCount() {
        $http.get('/api/v1/mediaGroups/medias/count', function (groupMapper) {
            $('.group-item.select-item').each(function () {
                var groupId = $(this).find('a').attr('id');
                var count = groupMapper[groupId] || 0;
                $(this).find('em').html(count);
            });
        });
    }


    function checkboxChecked($obj) {
        $obj.attr('checked', 'checked');
        $obj.next().removeClass('icon_checkbox_unchecked').addClass('icon_checkbox_checked');
        $('#js_move_all, #js_del_all').removeClass('btn_disabled');
    }

    function checkboxUnChecked($obj) {
        $obj.removeAttr("checked");
        if ($('.img-list').find('[checked="checked"]').length === 0) {
            $('#js_move_all, #js_del_all').addClass('btn_disabled');
        }
        $obj.next().removeClass('icon_checkbox_checked').addClass('icon_checkbox_unchecked');
    }

});
