'use strict';

require('../../../common/formvalidator');
var _ = require('underscore');
var app = require('../../../common/app');
var notify = require('../../../common/notify');
var uploader = require('../../../common/uploadifive');
var Loading = require('../../../components/Loading.vue');
var Vue = require('vue');

$(document).ready(function () {
    app = app();
    Vue.filter('visit', function (value) {
        return GLOBAL.visitUrl + '/' + value + '?imageView2/1/w/229/h/180/interlace/1';
    });
    Vue.component('product-item', {
        props: ['product', 'index'],
        template: "#productTemplate",
        methods: {
            delete: function () {
                var self = this;
                if (confirm('确定要删除该商品?')) {
                    $.ajax({
                        url: '/api/v1/scores/scoreExchanges/' + this.product._id,
                        method: 'DELETE'
                    }).then(function () {
                        self.$dispatch('delete-product', self.product._id);
                    })
                }
            },
            edit: function () {
                this.$parent.showModal(null, this.product);
            }
        }
    });
    Vue.component('product-modal', {
        data: function () {
            return {
                productName: "",
                imageKey: "",
                stock: 0,
                score: 0
            };
        },
        template: "#productModal",
        methods: {
            show: function (product) {
                if (product) {
                    this.$data = _.assign({}, product);
                } else {

                }
                $(this.$el).modal('show');
            },
            add: function () {
                if (!this.productName || this.productName.trim() === '') {
                    return app.notify.danger("商品名称不能为空");
                }
                if (isNaN(this.stock)) {
                    return app.notify.danger('商品数量必须为数字');
                }
                if (isNaN(this.score)) {
                    return app.notify.danger('兑换积分必须为数字');
                }
                if (!this.imageKey) {
                    return app.notify.danger("请上传商品图片");
                }
                var self = this;
                $.post('/api/v1/scores/scoreExchanges', this.$data).then(function (product) {
                    self.$dispatch('add-product', product);
                    $(self.$el).modal('hide');

                });
            }
        },
        ready: function () {
            var self = this;
            uploader({
                file: "imageUpload",
                done: function (ret) {
                    self.$set('imageKey', ret.key);
                }
            });
        }
    });

    new Vue({
        el: "#productApp",
        data: {
            loading: true,
            products: []
        },
        methods: {

            showModal: function (event, product) {
                this.$refs.modal.show(product || {});
            },

            addProduct: function (product) {
                var index = _.findIndex(this.products, function (pro) {
                    return product._id === pro._id;
                });
                if (index !== -1) {
                    this.products.$set(index, product);
                    app.notify.success("修改商品成功");
                } else {
                    this.products.push(product);
                    app.notify.success("添加商品成功");
                }
            },

            deleteProduct: function (productID) {
                this.products = _.filter(this.products, function (pro) {
                    return pro._id !== productID;
                });
                app.notify.success("删除商品成功");
            }
        },
        components: {
            'Loading': Loading
        },
        ready: function () {
            var self = this;
            $.get('/api/v1/scores/scoreExchanges').then(function (products) {
                self.products = products;
                self.loading = false;
            });
        }
    });

});
