'use strict';
var app = require('../../../common/app');
var Vue = require('vue');
var VueAsyncData = require('vue-async-data');
Vue.use(VueAsyncData);


$(document).ready(function () {
    app();
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
        }, methods: {
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

