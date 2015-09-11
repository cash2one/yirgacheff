'use strict';
/**
 * Created by Administrator on 14-12-31.
 */
define(['jquery', 'layerWrapper', 'datepicker'], function ($, layer) {
    var init = function () {
        //日期控件的选择校验
        var $start = $('#date-picker-start');
        var $end = $('#date-picker-end');

        $start.datetimepicker({
            lang: 'ch',
            format: 'Y-m-d H:i',
            onShow: function (ct) {
                this.setOptions({
                    maxDate: $end.val() ? $end.val() : false
                })
            }
        });

        $end.datetimepicker({
            lang: 'ch',
            format: 'Y-m-d H:i',
            onShow: function (ct) {
                this.setOptions({
                    minDate: $start.val() ? $start.val() : false
                })
            },
            onChangeDateTime: function (dp, $input) {
                //dp--> now
                var s = $start.val();
                var e = $input.val();
                var _s = new Date(s);
                var _e = new Date(e);
                if (_e < _s) {
                    layer.msg('结束时间不能小于开始时间');
                    $input.val('');
                    return false;
                }
            }
        });
    };
    return {
        init: init
    };
});
