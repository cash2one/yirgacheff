'use strict';
var app = require('../../../common/app');
var strftime = require('strftime');
var Vue = require('vue');
var Pagination = require('../../../components/Pagination.vue');
var Loading = require('../../../components/Loading.vue');
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
        return GLOBAL.visitUrl + '/' + value + '-list';
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
            'Pagination': Pagination,
            'Loading': Loading
        },
        data: {
            limit: 10,
            total: 0,
            events: [],
            template: 'all',
            loading: true
        },
        asyncData: function (resolve, reject) {
            var self = this;
            $.get('/api/v1/events?offset=0&limit=10').then(function (res) {
                resolve({
                    events: res.events,
                    total: res.total
                });
                self.loading = false;
            });
        },
        methods: {
            fetch: function (page) {
                var self = this;
                self.loading = true;
                page = page || 1;
                var skip = (page - 1) * this.limit;
                var url = '/api/v1/events?skip=' + skip + '&limit=' + self.limit + '&template=' + this.template;
                $.get(url).then(function (res) {
                    self.events = res.events;
                    self.total = res.total;
                    self.loading = false;
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

