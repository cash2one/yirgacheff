'use strict';

define(['jquery', 'layer', 'lazyLoad','slimscroll'], function ($, layer) {
    // Slimscroll
    $('.slimscroll').slimscroll({
        allowPageScroll: true
    });
    var init = function () {
        $("img.lazy").lazyload({
            effect: "fadeIn"
        });
        $(document).ready(function(){
            var height = document.body.offsetHeight;
            $(".page-sidebar").height(height);
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
        $('.response-comment').on('click', function(){
            layer.open({
                type: 1, //page层
                area: ['520px', ''],
                title: '在线反馈',
                shade: 0.6, //遮罩透明度
                moveType: 1, //拖拽风格，0是默认，1是传统拖动
                shift: -1, //0-6的动画形式，-1不开启
                content: $('#response-comment-dialog')
            });
        });
        $('.ok-message').on('click', function(){
            layer.msg('感谢您的反馈，我们会及时处理！');
        });


        //处理在线咨询
        $('.online_consultation').on('click', function(){
            layer.open({
                type: 1, //page层
                area: ['530px', ''],
                title: '添加下面的联系方式，方便和您及时沟通',
                shade: 0.6, //遮罩透明度
                moveType: 1, //拖拽风格，0是默认，1是传统拖动
                shift: -1, //0-6的动画形式，-1不开启
                content: $('#online-consultation-dialog')
            });
        });
    };


    return {
        init: init
    };
});
