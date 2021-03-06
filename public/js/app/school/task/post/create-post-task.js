'use strict';
requirejs(['jquery', 'leftMenu', 'headMenu', 'layerWrapper', 'easyDropDown'],
    function ($, leftMenu, headMenu, layer) {
        leftMenu.init();
        headMenu.init();
        var postList = $('#list-posts');
        var nonePosts = $('#none-posts');

        $('#post-category').change(function () {
            postList.find('li').hide();
            var category = $(this).val();
            var posts = null;
            if (category === '') {
                posts = postList.find('[data-category]');
            } else {
                posts = postList.find('[data-category="' + category + '"]');
            }
            if (posts.length > 0) {
                posts.show();
            } else {
                nonePosts.show();
            }
        });

        $('.frm_radio').click(function () {
            $('#list-posts').find('li').removeClass('selected');
            $(this).closest('li').addClass('selected');
        });

        //保存文章分享
        $('#post-share-save').click(function () {
            var name = $('#name').val();
            if (isEmpty(name)) {
                layer.msg('请填写任务名称');
                return;
            }
            var scoreAward = $('#scoreAward').val();
            if (isEmpty(scoreAward)) {
                layer.msg('请填写奖励积分');
                return;
            }
            if (!scoreAward.match('^[1-9][0-9]*$')) {
                layer.msg('积分必须为数字');
                return;
            }
            var item = $('input:radio[name="item"]:checked').attr('id');
            if (isEmpty(item)) {
                layer.msg('请选择要分享的文章');
                return;
            }
            $('#post-task-form').submit();
        });

        function isEmpty(parameter) {
            return !parameter || parameter === '';
        }

    });
