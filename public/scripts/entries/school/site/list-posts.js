'use strict';
var app = require('../../../common/app');
var notify = require('../../../common/notify');
var strftime = require('strftime');
var Vue = require('vue');
var Pagination = require('../../../components/Pagination');
var Loading = require('../../../components/Loading');
var VueAsyncData = require('vue-async-data');
Vue.use(VueAsyncData);

$(document).ready(function () {
    app();
    Vue.filter('date', function (value) {
        return strftime('%F %T', new Date(value));
    });
    Vue.filter('visit', function (value) {
        return GLOBAL.visitUrl + '/' + value;
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
        components: {
            'pagination': Pagination,
            'Loading': Loading
        },
        data: {
            loading: true,
            limit: 10,
            total: 0,
            posts: [],
            categories: [],
            category: $.getUrlParam('category') || 'all'
        },
        asyncData: function (resolve, reject) {
            var self = this;
            var url = '/api/v1/posts?skip=0&limit=' + this.limit;
            if (self.category !== 'all') {
                url += '&category=' + self.category;
            }
            $.get(url).then(function (res) {
                resolve({
                    posts: res.posts,
                    total: res.total
                });
                self.loading = false;
            });
            $.get('/api/v1/categories').then(function (categories) {
                resolve({
                    categories: categories
                })
            });
        },
        methods: {
            fetch: function (page) {
                this.loading = true;
                page = page || 1;
                var skip = (page - 1) * this.limit;
                var url = '/api/v1/posts?skip=' + skip + '&limit=' + this.limit;
                if (this.category !== 'all') {
                    url += '&category=' + this.category;
                }
                var self = this;
                $.get(url).then(function (res) {
                    self.posts = res.posts;
                    self.total = res.total;
                    self.loading = false;
                });
            },

            deletePost: function (index) {
                this.posts.splice(index, 1);
                this.total = this.total - 1;
            },
            pageChange: function (page) {
                this.fetch(page);
            }
        },
        computed: {
            categoryName: function () {
                var self = this;
                var index = _.findIndex(this.categories, function (c) {
                    return c._id === self.category;
                });
                if (index === -1) {
                    return '全部文章';
                }
                return this.categories[index].name;
            }
        },
        watch: {
            'category': function () {
                this.fetch();
            }
        }
    });

});

