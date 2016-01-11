'use strict';
var app = require('../../../common/app');
var notify = require('../../../common/notify');
var Vue = require('vue');
var VueAsyncData = require('vue-async-data');
Vue.use(VueAsyncData);


$(document).ready(function () {
    app();
    new Vue({
        el: "#postList",
        data: {
            posts: [],
            categories: [],
            currentCategory: ''
        },
        asyncData: function (resolve, reject) {
            $.get('/api/v1/posts/').then(function (posts) {
                resolve({
                    posts: posts
                })
            });
            $.get('/api/v1/categories').then(function (categories) {
                resolve({
                    categories: categories
                })
            });
        }, methods: {
            shouldShow: function (category) {
                var current = this.currentCategory;
                return current === '' || category === current;
            },

            selectCategory: function (category) {
                this.currentCategory = category;
            },

            deletePost: function (post, index) {
                if (confirm("确定删除所选文章?")) {
                    var url = '/api/v1/posts/' + post._id;
                    $.ajax({
                        url: url,
                        method: 'DELETE'
                    }).then(function () {
                        notify.success("删除文章成功");
                        this.posts.splice(index, 1);
                    });
                }
            }
        }
    });

});

