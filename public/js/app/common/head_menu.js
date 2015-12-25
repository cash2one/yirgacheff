'use strict';


var layer = require('layer');
var bootstrap = require('bootstrap');

var headMenu = function(){
    var init = function () {
        var $account = $('.m-header');
        $account.find('ul li.v-menu-hover').each(function () {
            $(this).hover(
                function () {
                    $(this).addClass('active');
                },
                function () {
                    $(this).removeClass('active');
                }
            )
        });

        $('.w-textarea').focus(function(){
            var value = $(this).val().trim();
            if(value === ''){
                $(this).text('');
            }

        });


        //帮助与支持
        $('#help').on('click', function(){
            layer.open({
                type: 1, //page层
                area: ['530px', ''],
                title: '添加下面的联系方式，方便和您及时沟通',
                shade: 0, //遮罩透明度
                moveType: 1, //拖拽风格，0是默认，1是传统拖动
                shift: -1, //0-6的动画形式，-1不开启
                content: $('#online-consultation-dialog')
            });
        });

        //返回顶部
        var $continue = $('.continue-add-homework');
        function backTop() {
            var h = $(window).height();
            var t = $(document).scrollTop();
            if (t > h) {
                $('#gotop').css('opacity', '1');
                if ($continue) {
                    $continue.show();
                }

            } else {
                $('#gotop').css('opacity', '0');
                if ($continue) {
                    $continue.hide();
                }
            }
        }

        backTop();
        $('#gotop').click(function () {
            $(document).scrollTop(0);
        });

        $(window).scroll(function (e) {
            backTop();
        });

    };
    return {
        init: init
    };
}
module.exports = headMenu();

//define(['jquery','layer','bootstrap'], function ($,layer) {
//    var init = function () {
//        var $account = $('.m-header');
//        $account.find('ul li.v-menu-hover').each(function () {
//            $(this).hover(
//                function () {
//                    $(this).addClass('active');
//                },
//                function () {
//                    $(this).removeClass('active');
//                }
//            )
//        });
//
//        $('.w-textarea').focus(function(){
//            var value = $(this).val().trim();
//            if(value === ''){
//                $(this).text('');
//            }
//
//        });
//
//
//        //帮助与支持
//        $('#help').on('click', function(){
//            layer.open({
//                type: 1, //page层
//                area: ['530px', ''],
//                title: '添加下面的联系方式，方便和您及时沟通',
//                shade: 0, //遮罩透明度
//                moveType: 1, //拖拽风格，0是默认，1是传统拖动
//                shift: -1, //0-6的动画形式，-1不开启
//                content: $('#online-consultation-dialog')
//            });
//        });
//
//        //返回顶部
//        var $continue = $('.continue-add-homework');
//        function backTop() {
//            var h = $(window).height();
//            var t = $(document).scrollTop();
//            if (t > h) {
//                $('#gotop').css('opacity', '1');
//                if ($continue) {
//                    $continue.show();
//                }
//
//            } else {
//                $('#gotop').css('opacity', '0');
//                if ($continue) {
//                    $continue.hide();
//                }
//            }
//        }
//
//        backTop();
//        $('#gotop').click(function () {
//            $(document).scrollTop(0);
//        });
//
//        $(window).scroll(function (e) {
//            backTop();
//        });
//
//    };
//    return {
//        init: init
//    };
//});