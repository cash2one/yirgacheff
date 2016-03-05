/**
 * Created by Admin on 2016/1/30.
 */

import Vue from 'vue';
import app from  '../../../common/app';
import notify from '../../../common/notify';
import vIcon from '../../../components/iconfont';
var strftime = require('strftime');
var Loading = require('../../../components/Loading.vue');
var Pagination = require('../../../components/Pagination.vue');
var VueAsyncData = require('vue-async-data');

$(document).ready(function () {
    app();
    var eventId = $("#eventId").val();
    Vue.filter('date', function (value) {
        return strftime('%F', new Date(value));
    });
    Vue.filter('visit', function (value) {
        return GLOBAL.visitUrl + '/' + value + '-enroll';
    });
    Vue.use(VueAsyncData);
    Vue.component('player-item', {
        template: '#playerItemTemplate',
        props: ['player', 'index', 'delete', 'audit']
    });
    Vue.component('Loading', Loading);
    Vue.component('Pagination', Pagination);
    new Vue({
        el: "#enrollApp",
        data: {
            loading: true,
            players: [],
            refreshFlag: 0,
            page: 1,
            limit: 10,
            total: 0
        },
        asyncData: function (resolve, reject) {
            var self = this;
            $.get(`/api/v1/events/vote/${eventId}/votePlayer?isAudit=false&page=${this.page}&limit=${this.limit}`)
                .then(function (res) {
                    resolve({
                        players: res.players,
                        total: res.total
                    });
                    self.loading = false;
                });
        },
        methods: {
            auditAll: function () {
                if (this.players.length <= 0) {
                    return notify.warning('当前没有需要审核的报名信息');
                }
                if (confirm('确定审核当前页所有的报名信息?')) {
                    var ids = this.players.map((player)=> {
                        return player._id;
                    });
                    this.auditPlayer(ids);
                }
            },

            auditPlayer: function (player) {
                var self = this;
                $.ajax({
                    url: `/api/v1/events/vote/auditPlayers`,
                    method: 'PUT',
                    data: {
                        players: player
                    }
                }).then(function () {
                    notify.success("审核成功");
                    self.refresh();
                })
            },

            deletePlayer: function (player, index) {
                var self = this;
                if (confirm('确定删除该报名信息?')) {
                    $.ajax({
                        url: `/api/v1/events/vote/votePlayer/${player}`,
                        method: 'DELETE'
                    }).then(function () {
                        notify.success("删除成功");
                        self.refresh();
                    })
                }
            },
            pageChange: function (page) {
                this.page = page;
                this.refresh();
            },

            refresh: function () {
                this.loading = true;
                this.refreshFlag = this.refreshFlag + 1;
            }
        },
        watch: {
            refreshFlag: 'reloadAsyncData'
        }
    });
});