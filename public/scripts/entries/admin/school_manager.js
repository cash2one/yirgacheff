/**
 * Created by Administrator on 14-12-19.
 */

requirejs(['jquery', 'leftMenu', 'headMenu', 'layerWrapper', 'jqueryExt', 'datatables', 'easyDropDown'],
    function ($, leftMenu, headMenu, layer) {
        $(document).ready(function () {
            leftMenu.init();
            headMenu.init();
            //表格
            var dataTable = $('#schools-list').dataTable({
                "bAutoWidth": true,
                'language': {
                    'url': '/js/lib/plugins/dataTable/Chinese.lang'
                }
            });

            $('#add-school-btn').bind('click', function () {
                $('#school_form')[0].reset();
                layer.open('add-school-dialog', function (index) {
                    var schoolInfo = $('#school_form').serializeObject();
                    if (schoolInfo.schoolName === '') {
                        layer.msg('学校名字不能为空');
                        return;
                    }
                    if (schoolInfo.displayName === '') {
                        layer.msg('校长名字不能为空');
                        return;
                    }
                    if (schoolInfo.contact === '') {
                        layer.msg('联系方式不能为空');
                        return;
                    }

                    $.post('/admin/schools', schoolInfo, function (res) {
                        if (res.code === 200) {
                            layer.close(index);
                            layer.msg('添加学校信息成功!');
                        } else {
                            layer.msg(res.message);
                        }
                    });
                });
            });
        });
    });