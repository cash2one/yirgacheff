'use strict';
var app = require('../../../../common/app');
$(document).ready(function () {
    app();
    var postList = $('#list-posts');
    var nonePosts = $('#none-posts');
    $('#post-category').change(function () {
        postList.find('tr').hide();
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


});

