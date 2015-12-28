'use strict';
requirejs(['jquery', 'restfulClient', 'leftMenu', 'headMenu', 'layerWrapper', 'pagination', 'easyDropDown'],
    function ($, $http, leftMenu, headMenu, layer, pagination) {
        leftMenu.init();
        headMenu.init();
        $('#selectCategory').change(function () {
            var selectCategory = $(this).val();
            var url = '/school/posts';
            if (!!selectCategory) {
                url = url + '?category=' + selectCategory;
            }
            self.location.href = url;
        });

        $('.del_btn').click(function () {
            var postId = $(this).attr('id');
            var current = $(this).closest('li');
            layer.confirm('确定要删除所选文章?', function () {
                var url = '/api/v1/posts/' + postId;
                $http.del(url, function () {
                    current.remove();
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
        var total = pagination.totalNum('list-posts', 'posts-count');
        if (total > 0) {
            pagination.paginate('list-posts', total, 10, 'pagination');
        }

    });
