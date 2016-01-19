'use strict';
var app = require('../../../common/app');
var strftime = require('strftime');
var _ = require('underscore');
var Vue = require('vue');
var VueAsyncData = require('vue-async-data');
Vue.use(VueAsyncData);

var TEMPLATES = {
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
            eventType: function () {
                return TEMPLATES[this.event.template];
            }
        }
    });
    new Vue({
        el: "#eventList",
        data: {
            cache: [],
            currentCategory: '全部活动'
        },
        asyncData: function (resolve, reject) {
            $.get('/api/v1/events').then(function (events) {
                resolve({
                    cache: events
                })
            });
        },
        methods: {
            changeState: function (state) {
                var self = this;
                $.get('/api/v1/events?state=' + state).then(function (events) {
                    self.events = events
                });
            },
            shouldShow: function (category) {
                var current = this.currentCategory;
                return current === '' || category === current;
            },
            selectCategory: function (category) {
                this.currentCategory = category;
            }
        },
        computed: {
            events: function () {
                var vm = this;
                if (vm.currentCategory === '全部活动') {
                    return vm.cache;
                }
                return _.filter(vm.cache, function (event) {
                    return TEMPLATES[event.template] === vm.currentCategory;
                });
            }
        }
    });
});

