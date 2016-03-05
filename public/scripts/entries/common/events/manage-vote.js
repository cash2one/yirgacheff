/**
 * Created by Admin on 2016/1/28.
 */
'use strict';

import Vue from 'vue';
import VueAsyncData from 'vue-async-data';
import _ from 'underscore';
import app from  '../../../common/app';
import notify from '../../../common/notify';
import vUpload from '../../../components/upload';
import vIcon from '../../../components/iconfont';
import Pagination from '../../../components/Pagination';
import 'webui-popover/dist/jquery.webui-popover';
import 'webui-popover/dist/jquery.webui-popover.css';
var Loading = require('../../../components/Loading.vue');


$(document).ready(function () {
    var voteId = $("#voteId").val();
    Vue.filter('visit', function (value) {
        return GLOBAL.visitUrl + '/' + value + '-enroll';
    });
    Vue.use(VueAsyncData);
    Vue.component('v-upload', vUpload);
    Vue.component('v-icon', vIcon);
    Vue.component('v-pagination', Pagination);
    Vue.component('Loading', Loading);

    Vue.component('player-modal', {
        template: '#playerModal',
        props: ['addPlayer'],
        data: function () {
            var player = {
                _id: '',
                images: [],
                name: '',
                brief: '',
                isAudit: true
            };
            return {player: player};
        },
        methods: {
            addImage: function (res) {
                this.player.images.push(res.key);
            },
            deleteImage: function (index) {
                this.player.images.splice(index, 1);
            }
        },
        events: {
            show: function (player = {}) {
                _.assign(this.player, player);
                if (player.images) {
                    this.player.images = [...player.images];
                }
                $(this.$el).modal("show");
            },
            hide: function () {
                $(this.$el).modal("hide");
            }
        }
    });

    Vue.component('player-item', {
        template: "#playerItem",
        props: ['player', 'index', 'deletePlayer'],
        data: function () {
            return {
                addedPoll: 0,
                subedPoll: 0
            }
        },
        ready: function () {
            $('a.sup').webuiPopover({animation: 'pop'});
            $('a.opp').webuiPopover({animation: 'pop'});
        },
        methods: {
            addPoll: function () {
                var self = this;
                var poll = parseInt(this.addedPoll);
                if (!_.isNumber(poll)) {
                    return notify.danger('票数必须为整数');
                }
                $.ajax({
                    url: `/api/v1/events/vote/votePlayer/${this.player._id}/poll`,
                    method: 'PUT',
                    data: {
                        poll: poll
                    }
                }).then(function (res) {
                    self.addedPoll = 0;
                    self.player.poll = res.poll;
                    notify.success("添加票数成功");
                })
            },
            subPoll: function () {
                var self = this;
                var poll = parseInt(this.subedPoll);
                if (!_.isNumber(poll)) {
                    return notify.danger('积分必须为整数');
                }
                poll = 0 - poll;
                $.ajax({
                    url: `/api/v1/events/vote/votePlayer/${this.player._id}/poll`,
                    method: 'PUT',
                    data: {
                        poll: poll
                    }
                }).then(function (res) {
                    self.player.poll = res.poll;
                    self.subedPoll = 0;
                    notify.success("减少票数成功");
                })
            },
            update: function () {
                this.$parent.$refs.modal.$emit('show', this.player);
            }
        }
    });

    new Vue({
        el: '#voteApp',
        data: {
            visible: false,
            players: [],
            total: 0,
            loading: true,
            limit: 10,
            page: 1,
            order: '-sequence',
            orderTxt: '按时间排序',
            search: '',
            refreshFlag: 0
        },
        asyncData: function (resolve, reject) {
            var self = this;
            var url = `/api/v1/events/vote/${voteId}/votePlayer?isAudit=true&page=${this.page}&limit=${this.limit}&order=${this.order}&search=${this.search}`;
            $.get(url).then(function (res) {
                resolve({
                    players: res.players,
                    total: res.total
                });
                self.loading = false;
            });
        },

        methods: {
            showModal: function () {
                this.$broadcast('show');
            },

            deletePlayer: function (player) {
                if (confirm("是否删除该选手?")) {
                    $.ajax({
                        url: `/api/v1/events/vote/votePlayer/${player._id}`,
                        method: 'DELETE'
                    }).then(function () {
                        notify.success("删除选手成功");
                    });
                }
                this.refresh();
            },
            addPlayer: function (player) {
                var self = this;
                if (player.name === "") {
                    return notify.danger("选手名字不能为空");
                }
                if (player.images.length === 0) {
                    return notify.danger("至少添加一张选手图片");
                }
                if (player.brief === "") {
                    return notify.danger("选手简介不能为空");
                }
                $.post(`/api/v1/events/vote/${voteId}/votePlayer`, player).then(function () {
                    notify.success("操作成功");
                    self.$broadcast("hide");
                    if (!player._id || player._id === '') {
                        self.refresh();
                    } else {
                        var index = _.findIndex(self.players, function (p) {
                            return player._id === p._id;
                        });
                        if (index !== -1) {
                            self.players.$set(index, player);
                        }
                    }
                });
            },
            pageChange: function (page) {
                this.page = page;
                this.refresh();
            },

            orderBy: function (order) {
                this.order = order;
                if (order === '-sequence') {
                    this.orderTxt = '按时间排序';
                } else {
                    this.orderTxt = '按票数排序';
                }
                this.page = 1;
                this.refresh();
            },

            searchBy: function () {
                this.page = 1;
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