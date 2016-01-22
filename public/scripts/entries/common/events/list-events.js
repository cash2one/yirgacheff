'use strict';
var app = require('../../../common/app');
var strftime = require('strftime');
var _ = require('underscore');
var Vue = require('vue');
var Pagination = require('../../../components/Pagination');
var VueAsyncData = require('vue-async-data');
Vue.use(VueAsyncData);
var TEMPLATES = {
    'all': '全部',
    'article': '文章',
    'activity': '活动',
    'audition': '试听课',
    'classroom': '在线课堂'
};
$(document).ready(function () {
    app();
    Vue.filter('date', function (value) {
        return strftime('%F %T', new Date(value));
    });
    Vue.filter('visit', function (value) {
        return GLOBAL.visitUrl + '/' + value;
    });
    Vue.component('event-item', {
        props: ['event'],
        template: "#eventItem",
        computed: {
            templateName: function () {
                return TEMPLATES[this.event.template];
            }
        }
    });

    new Vue({
        el: "#eventList",
        components: {
            'Pagination': Pagination
        },
        data: {
            limit: 10,
            total: 0,
            events: [],
            template: 'all'
        },
        asyncData: function (resolve, reject) {
            $.get('/api/v1/events?offset=0&limit=10').then(function (res) {
                resolve({
                    events: res.events,
                    total: res.total
                })
            });
        },
        methods: {
            fetch: function (page) {
                var self = this;
                page = page || 1;
                var skip = (page - 1) * this.limit;
                var url = '/api/v1/events?skip=' + skip + '&limit=' + self.limit + '&template=' + this.template;
                $.get(url).then(function (res) {
                    self.events = res.events;
                    self.total = res.total;
                });
            },
            pageChange: function (page) {
                this.fetch(page);
            }
        },
        computed: {
            templateName: function () {
                return TEMPLATES[this.template];
            }
        },

        watch: {
            'template': function (val) {
                this.fetch();
            }
        }
    });
});

