'use strict';

define(['jquery', 'layerWrapper', 'lazyLoad'], function ($, layer) {
    var init = function () {
        $("img.lazy").lazyload({
            effect: "fadeIn"
        });

        //处理左侧菜单栏的选中状态
        var sideMenu = $(".m-side-menu");

        //手风琴效果展示
        sideMenu.find("ul li.pull-down").click(function () {
            var $ink = $(this).find(".one-level");
            var $obj = $(this).find(".pull-level");
            var view = $obj.is(":visible");
            if (!view) {
                $obj.css('display', 'block');
                $ink.css('background-position', '200px 27px');
            }
            else {
                $obj.css('display', 'none');
                $ink.css('background-position', '200px -5px');
            }
            $(this).siblings(".pull-down").
                find(".pull-level").css('display', 'none');
            $(this).siblings(".pull-down").
                find(".one-level").css('background-position', '200px -5px');
        });


        //处理反馈信息
        $('.response-comment').click(function () {
            layer.open('response-comment-dialog', function (index) {
                $('#response-content').val('');
                layer.close(index);
                layer.msg('感谢您的反馈，我们会及时处理！');
            });
        });


        //处理在线咨询
        $('.online_consultation').click(function () {
            layer.open('online-consultation-dialog', function (index) {
                layer.close(index);

            });
        });

    };


    return {
        init: init
    };
});
