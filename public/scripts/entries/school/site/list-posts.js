'use strict';
var app = require('../../../common/app');
var notify = require('../../../common/notify');
var _ = require('underscore');
var strftime = require('strftime');
var Vue = require('vue');
var VueAsyncData = require('vue-async-data');
Vue.use(VueAsyncData);


$(document).ready(function () {
    app();

    Vue.filter('date', function (value) {
        return strftime('%F %T', new Date(value));
    });

    Vue.component('post-item', {
        props: ['post', 'index'],
        template: '#postTemplate',
        methods: {
            delete: function () {
                var vm = this;
                if (confirm("确定删除所选文章?")) {
                    var url = '/api/v1/posts/' + vm.post._id;
                    $.ajax({
                        url: url,
                        method: 'DELETE'
                    }).then(function () {
                        notify.success("删除文章成功");
                        vm.$dispatch('delete-post', vm.index);
                    });
                }
            }
        }
    });

    new Vue({
        el: "#postApp",

        data: {
            cache: [],
            categories: [],
            currentCategory: '全部文章'
        },
        asyncData: function (resolve, reject) {
            $.get('/api/v1/posts/').then(function (posts) {
                resolve({
                    cache: posts
                })
            });
            $.get('/api/v1/categories').then(function (categories) {
                resolve({
                    categories: categories
                })
            });
        },
        methods: {
            selectCategory: function (category) {
                this.currentCategory = category;
            }
        },
        computed: {
            posts: function () {
                var vm = this;
                if (vm.currentCategory === '全部文章') {
                    return vm.cache;
                }
                return _.filter(vm.cache, function (post) {
                    return post.category.name === vm.currentCategory;
                });
            },

            deletePost: function (index) {
                this.cache.splice(index, 1);
            }
        }
    });

});

