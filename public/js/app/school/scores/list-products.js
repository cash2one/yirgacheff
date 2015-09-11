'use strict';


requirejs(['jquery', 'restfulClient', 'leftMenu', 'headMenu', 'layerWrapper', 'upload', 'validator', 'lightbox'],
    function ($, $http, leftMenu, headMenu, layer, upload, validator) {
        leftMenu.init();
        headMenu.init();
        var $img = $('#imagePreview');
        var $productForm = $('#product-form');
        upload.imgUploader({
            onComplete: function (file, done) {
                $img.attr('src', file.url);
                $productForm.find('input[name="imageKey"]').val(file.key);
                done();
            }
        });

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
