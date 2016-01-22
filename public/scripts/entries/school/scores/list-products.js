'use strict';

require('../../../common/formvalidator');
var app = require('../../../common/app');
var notify = require('../../../common/notify');
var uploader = require('../../../common/uploadifive');

$(document).ready(function () {
    var $productForm = $('#productForm');
    app();
    uploader({
        file: "imageUpload",
        done: function (ret) {
            $('#imagePreview').attr("src", ret.path);
            $('#imageKey').val(ret.key);
        }
    });

    $productForm.validate(function ($form, data) {
        $.post('/api/v1/scores/scoreExchanges', data).then(function () {
            self.location.href = '';
        });
    });


    $('#product-list').on('click', '.delete-btn', function () {
        var self = $(this);
        if (confirm("确定删除该商品?")) {
            var current = self.closest('li');
            var url = '/api/v1/scores/scoreExchanges/' + current.attr('id');
            $.ajax({
                url: url,
                method: 'DELETE'
            }).then(function () {
                notify.success("删除商品成功");
                current.remove();
            });
        }
    });

});
