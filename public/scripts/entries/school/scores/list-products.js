'use strict';
var validator = require('validator');
var app = require('../../../common/app');
var $http = require('../../../common/restfulClient');
var layer = require('../../../common/layerWrapper');
var uploader = require('../../../common/uploadifive');

$(document).ready(function () {
    app();
    uploader({
        file: "imageUpload",
        done: function (ret) {
            $('#imagePreview').attr("src", ret.path);
            $('#imageKey').val(ret.key);
        }
    });
    var $productForm = $('#product-form');

    function formValidator(data) {
        if (data.productName === "") {
            return '商品名称不能为空';
        }
        if (data.stock === "" || !validator.isInt(data.stock)) {
            return '商品存量不能为空或者非数字';
        }
        if (data.imageKey === "") {
            return '商品图片不能为空';
        }
        if (data.score === "" || !validator.isInt(data.score)) {
            return '兑换积分不能为空或者非数字';
        }
    }

    //添加商品
    $('#add-product-btn').click(function () {
        layer.ajaxForm({
            title: '添加商品',
            container: 'add-product-dialog',
            form: $productForm,
            validator: formValidator,
            ajax: {
                type: 'POST',
                url: '/api/v1/scores/scoreExchanges',
                success: function (data, done) {
                    done();
                    self.location.href = '';
                }
            }
        });
    });

    $('#product-list').on('click', '.delete-btn', function () {
        var self = $(this);
        layer.confirm('确定删除该兑换商品?', function () {
            var current = self.closest('li');
            var url = '/api/v1/scores/scoreExchanges/' + current.attr('id');
            $http.del(url, function () {
                current.remove();
            });
        });
    });

    $('.product-photo-thumb').hover(function () {
        $('.product-hover-mask', this).show();
    }, function () {
        $('.product-hover-mask', this).hide();
    });
});
