'use strict';
requirejs(['jquery', 'vdatePicker', 'leftMenu', 'headMenu', 'layerWrapper', 'easyDropDown', 'datepicker'],
    function ($, vdatePicker, leftMenu, headMenu, layer) {
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
            $('#activityForm').submit();
        });

        function isEmpty(parameter) {
            return !parameter || parameter === '';
        }




    });
