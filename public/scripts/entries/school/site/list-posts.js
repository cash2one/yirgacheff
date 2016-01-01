'use strict';
var app = require('../../../common/app');
var notify = require('../../../common/notify');


$(document).ready(function () {
    app();

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
        var current = $(this).closest('tr');
        if (confirm("确定删除所选文章?")) {
            var url = '/api/v1/posts/' + postId;
            $.ajax({
                url: url,
                method: 'DELETE'
            }).then(function () {
                notify.success("删除文章成功");
                current.remove();
            });
        }
    });

});

