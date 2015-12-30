'use strict';
var app = require('../../../common/app');
var layer = require('../../../common/layerWrapper');
var $http = require('../../../common/restfulClient');


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
        var current = $(this).closest('li');
        layer.confirm('确定要删除所选文章?', function () {
            var url = '/api/v1/posts/' + postId;
            $http.del(url, function () {
                current.remove();
            });
        });
    });

    $(function () {
        $(".delete").popover({html : true });
    });


});

