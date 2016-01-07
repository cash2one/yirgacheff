'use strict';
var app = require('../../../common/app');
var notify = require('../../../common/notify');


$(document).ready(function () {
    app();

    //暂无文章
    var item = $("#list-posts").find("li").length;
    if(item == 0){
        $(".post-item").find('#tips').removeClass("hides");
    }

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

