'use strict';

define(['jquery','layerWrapper'], function ($,layer) {
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
        $('#help').click(function(){
            layer.open('online-consultation-dialog', function (index) {
                layer.close(index);
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
});