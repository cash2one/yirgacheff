'use strict';
requirejs(['jquery', 'restfulClient', 'vdatePicker', 'leftMenu', 'headMenu', 'layerWrapper', 'richEditor', 'pagination', 'easyDropDown', 'datepicker'],
    function ($, $http, vdatePicker, leftMenu, headMenu, layer, richEditor, pagination) {
        leftMenu.init();
        headMenu.init();
        //日期控件
        $('.w-datepicker').datetimepicker({
                lang: 'ch',
                format: 'Y-m-d H:i'
            }
        );
        //日期控件的选择校验
        vdatePicker.init();
        richEditor.render('activity-detail');
        //添加信息栏
        $('#add-title-info').click(function () {
            var size = $('#title-info-list').find('li').size();
            if (size > 5) {
                layer.msg('最多只能设置 5 项报名信息');
                return false;
            }
            layer.open('add-title-info-dialog', function (index) {
                var infoName = $('#titleInfoName').val();
                if (!infoName || infoName.trim() === '') {
                    layer.msg('信息名称不能为空');
                    return;
                }
                var li_content = '<li class="item">' + infoName +
                    '<input type="hidden" name="infoCollect" value="' + infoName + '">' +
                    '<i class="fa fa-times deleteInfo"></i></li>';
                $('#add-title-info').before(li_content);
                layer.close(index);
            });
        });
        $('#infoList').on('click', '.deleteInfo', function () {
            $(this).closest('li').remove();
        });

        //保存
        $('#activity-share-save').click(function () {
            var name = $('#name').val();
            if (isEmpty(name)) {
                layer.msg('任务名称不能为空');
                return;
            }
            var scoreAward = $('#scoreAward').val();
            if (isEmpty(scoreAward)) {
                layer.msg('奖励积分不能为空');
                return;
            }
            if (!scoreAward.match('^[1-9][0-9]*$')) {
                layer.msg('积分必须为数字');
                return;
            }
            var theme = $('#theme').val();
            if (isEmpty(theme)) {
                layer.msg('活动主题不能为空');
                return;
            }
            var s_date = $('#date-picker-start').val();
            if (isEmpty(s_date)) {
                layer.msg('开始时间不能为空');
                return;
            }
            var e_date = $('#date-picker-end').val();
            if (isEmpty(e_date)) {
                layer.msg('结束时间不能为空');
                return;
            }
            var location = $('#activity-location').val();
            if (isEmpty(location)) {
                layer.msg('活动地点不能为空');
                return;
            }
            var content = $('#activity-detail').val();
            if (isEmpty(content)) {
                layer.msg('活动详情不能为空');
                return;
            }
            var taskId = $('#taskId').val();
            var infoCollect = [];
            $('input[name="infoCollect"]').each(function () {
                infoCollect.push($(this).val());
            });
            $http.put('/api/v1/tasks/' + taskId, {
                name: name,
                scoreAward: scoreAward,
                theme: theme,
                startTime: s_date,
                endTime: e_date,
                address: location,
                content: content,
                infoCollect: infoCollect
            }, function () {
                layer.msg('修改成功');
            });
        });

        function isEmpty(parameter) {
            return !parameter || parameter === '';
        }

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


        //分页初始化
        function initPaging() {
            $('#list-register').find('li.data').each(function (index) {
                if (index > 4)$(this).hide();
            });
        }

        initPaging();

        //分页
        var total = pagination.totalNum('list-register', 'register-counter');
        if (total > 0) {
            pagination.paginate('list-register', total, 5, 'pagination');
        }


    });
