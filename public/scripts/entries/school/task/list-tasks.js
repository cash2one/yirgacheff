'use strict';

var app = require('../../../common/app');
var layer = require('../../../common/layerWrapper');
var $http = require('../../../common/restfulClient');
var list = require('../../../lib/list');

$(document).ready(function () {
    app();
    var postList = $('#list-posts');

    //过滤条件
    $('.opts-area').find('.item').each(function () {
        $(this).bind('click', function () {
            var selected = $(this).hasClass('selected');
            if (!selected) {
                $(this).addClass('selected').siblings().removeClass('selected');
            }
            var state = $(this).attr('data-state');
            if (!isEmpty(state)) {
                postList.find('li').hide();
                postList.find('[data-state="' + state + '"]').show();
            } else {
                postList.find('li').show();
            }

            var temp = 0;
            $('#list-posts').find('li').each(function (index) {
                var display = $(this).is(':hidden');
                if (!display) {
                    temp += 1;
                    if (temp > 10) {
                        $(this).hide();
                    }
                }
            });
        });
    });

    //关闭任务
    $('.close-task').click(function () {
        var task = $(this).closest('li');
        if (task.attr('data-state') === '1') {
            layer.msg('任务已经关闭');
            return;
        }
        var taskId = task.attr('id');
        layer.confirm('确定要关闭所选任务?', function () {
            var url = '/api/v1/tasks/' + taskId + '/close';
            $http.put(url, function () {
                layer.msg('关闭任务成功');
                self.location.href = '';
            });
        });
    });

    //删除任务
    $('.del_btn').click(function () {
        var task = $(this).closest('li');
        if (task.attr('data-state') === '0') {
            layer.msg('任务进行中，不能删除，请先关闭任务');
            return;
        }
        var taskId = task.attr('id');
        layer.confirm('确定要删除所选任务?', function () {
            var url = '/api/v1/tasks/' + taskId;
            $http.del(url, function () {
                layer.msg('删除成功');
                self.location.href = '';
            });
        });
    });


    function isEmpty(parameter) {
        return !parameter || parameter === '';
    }

});
