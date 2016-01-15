'use strict';
var app = require('../../../common/app');
var strftime = require('strftime');
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
        return strftime('%F', new Date(value));
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
            events: []
        },
        asyncData: function (resolve, reject) {
            $.get('/api/v1/events').then(function (events) {
                resolve({
                    events: events
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
        }
    });

});

