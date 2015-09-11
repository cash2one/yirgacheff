'use strict';
requirejs(['jquery', 'restfulClient', 'leftMenu', 'headMenu', 'layerWrapper', 'pagination', 'easyDropDown'],
    function ($, $http, leftMenu, headMenu, layer, pagination) {
        leftMenu.init();
        headMenu.init();
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

                var total = pagination.totalNumExt('list-posts', 'tasks-count', state);
                var temp = 0;
                $('#list-posts').find('li').each(function(index){
                    var display = $(this).is(':hidden');
                    if(!display){
                        temp += 1;
                        if(temp > 10){
                            $(this).hide();
                        }
                    }
                });
                if(total > 0){
                    pagination.paginateExt('list-posts', total, 10, 'pagination', state);
                }
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

        //初始化
        function initPaging() {
            $('#list-posts').find('li').each(function (index) {
                if (index > 9)$(this).hide();
            });
        }

        initPaging();

        //分页
        function listTaskPages() {
            var total = pagination.totalNumExt('list-posts', 'tasks-count','');
            if (total > 0) {
                pagination.paginate('list-posts', total, 10, 'pagination');
            }
        }

        listTaskPages();

        function isEmpty(parameter) {
            return !parameter || parameter === '';
        }

    });
