'use strict';

define(['jquery'], function ($) {

    var init = function (id) {
        var clazz = 'even',
            second = 4000,
            index = 0,			//default
            idx = $(id),				//id
            pic = idx.find('li');		//listBox
        var time = setInterval(function () {
            index++;
            initSwitch();
        }, second);

        if (pic.prevAll().length > 0) {
            //遍历
            pic.eq(0).show().siblings().hide();
            pic.each(function (i) {
                idx.find('.tab').append('<span class="prve ' + (i === index ? clazz : '') + '">' + (i + 1) + '</span>');
            });
        }

        //通用
        function initSwitch() {
            if (index >= pic.length) {
                index = 0;
            }
            if (index < 0) {
                index = pic.length - 1;
            }
            idx.find('.prve').eq(index).addClass(clazz).siblings().removeClass(clazz);
            switch (0) {
                case 1 :
                    pic.eq(index).fadeIn(500).siblings().fadeOut(500);
                    break;
                default :
                    pic.eq(index).fadeIn(60).siblings().hide();
            }
        }

        //经过
        idx.find('.prve, li').on('mouseover', function () {
            clearInterval(time);
            index = $(this).prevAll().length;
            initSwitch();
        }).on('mouseout', function () {
            time = setInterval(function () {
                index++;
                initSwitch();
            }, second);
        });

        //左点击
        idx.find('.back, .next').on('click', function () {
            switch ($(this).attr('class')) {
                case 'back':
                    index--;
                    break;
                case 'next':
                    index++;
                    break;
            }
            initSwitch();
            clearInterval(time);
            time = setInterval(function () {
                index++;
                initSwitch();
            }, second);
        });
    };
    return {
        init: init
    };
});