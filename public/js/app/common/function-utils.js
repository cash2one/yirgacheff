'use strict';
/**
 * Created by Administrator on 14-12-12.
 */


define(['jquery'], function ($) {

    //数字动画显示
    var animateNumber = function (id, value, frequency) {
        $('#'+id)
            .animateNumber({easing: 'easeInQuad',
                            number: value}, frequency);
    };

    //字符串过长, 省略
    var omitString = function (value, endIndex) {
        var result = '';
        if (value.length >= endIndex) {
            result = value.trim().substring(0, endIndex) + '...'
        } else {
            result = value;
        }
        return result;
    };


    var loadingMaskerShow = function(id){
        var $obj = $('#' + id);
        var _progressBar = '<div class="loading-progressBar">数据加载中，请稍等...</div>';
        $obj.prepend(_progressBar);
    }

    var loadingMaskerHide = function(id){
        var $obj = $('#' + id);
        $obj.find('.loading-progressBar').remove();
    }


    return {
        animateNumber: animateNumber,
        omitString:omitString,
        loadingMaskerShow:loadingMaskerShow,
        loadingMaskerHide:loadingMaskerHide
    };
});
