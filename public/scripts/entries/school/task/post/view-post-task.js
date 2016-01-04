'use strict';
require('../../../../common/formvalidator');
var notify = require('../../../../common/notify');
var app = require('../../../../common/app');
$(document).ready(function () {
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


    $("#taskForm").validate(function ($form, data) {
        var url = '/api/v1/tasks/' + $("#taskId").val();
        $.ajax({
            url: url,
            method: 'PUT',
            data: data
        }).then(function () {
            notify.success("修改任务成功");
        })
    });

});

