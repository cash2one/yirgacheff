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

$(document).ready(function () {
    var voteId = $("#voteId").val();
    Vue.filter('visit', function (value) {
        return GLOBAL.visitUrl + '/' + value;
    });
    Vue.use(VueAsyncData);
    Vue.component('v-upload', vUpload);
    Vue.component('v-icon', vIcon);
    Vue.component('v-pagination', Pagination);
    Vue.component('player-modal', {
        template: '#playerModal',
        data: function () {
            return {
                _id: '',
                images: [],
                name: '',
                brief: '',
                isAudit: true,
                vote: voteId
            };
        },
        methods: {

            addImage: function (res) {
                this.images.push(res.key);
            },

            deleteImage: function (index) {
                this.images.splice(index, 1);
            },

            add: function () {
                var player = this.$data;
                if (this._id && this._id !== '') {
                    player._id = this._id;
                }
                var vm = this;
                if (player.name === "") {
                    return notify.danger("选手名字不能为空");
                }
                if (player.images.length === 0) {
                    return notify.danger("至少添加一张选手图片");
                }
                if (player.brief === "") {
                    return notify.danger("选手简介不能为空");
                }
                $.post('/api/v1/events/vote/votePlayer', player)
                    .then(function (player) {
                        notify.success("操作成功");
                        vm.$emit("hide");
                        vm.$dispatch('add-player', player);
                    });
            }
        },

        events: {
            show: function (player = {}) {
                $(this.$el).modal("show");
                this.images = player.images || [];
                this.name = player.name || '';
                this.brief = player.brief || '';
                this._id = player._id;
            },
            hide: function () {
                $(this.$el).modal("hide");
            }
        }
    });

    Vue.component('player-item', {
        template: "#playerItem",
        props: ['player', 'index'],
        methods: {
            update: function () {
                this.$parent.$refs.modal.$emit('show', this.player);
            },
            delete: function () {
                var playerId = this.player._id;
                var vm = this;
                if (confirm("是否删除该选手?")) {
                    $.ajax({
                        url: `/api/v1/events/vote/votePlayer/${playerId}`,
                        method: 'DELETE'
                    }).then(function () {
                        notify.success("删除选手成功");
                        vm.$dispatch('delete-player', vm.index);
                    });
                }
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
            skip: 0,
            order: '-sequence',
            orderTxt: '按时间排序',
            search: ''
        },

        asyncData: function (resolve, reject) {
            var self = this;
            $.get(`/api/v1/events/vote/${voteId}/votePlayer?isAudit=true&skip=0&limit=${this.limit}&order=-sequence`)
                .then(function (res) {
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

            deletePlayer: function (index) {
                this.players.splice(index, 1);
            },

            addPlayer: function (player) {
                if (!player._id || player._id === '') {
                    this.players.unshift(player);
                } else {
                    var index = _.findIndex(this.players, function (p) {
                        return player._id === p._id;
                    });
                    if (index !== -1) {
                        this.players.$set(index, player);
                    }
                }
            },

            pageChange: function (page) {
                this.skip = (page - 1) * this.limit;
                this.fetch();
            },

            orderBy: function (order) {
                this.order = order;
                if (order === '-sequence') {
                    this.orderTxt = '按时间排序';
                } else {
                    this.orderTxt = '按票数排序';
                }
                this.skip = 0;
                this.fetch();
            },

            searchBy: function () {
                this.skip = 0;
                this.fetch();
            },

            fetch: function () {
                var vm = this;
                var url = `/api/v1/events/vote/${voteId}/votePlayer?isAudit=true&skip=${this.skip}&limit=${this.limit}&order=${this.order}&search=${this.search}`;
                $.get(url).then(function (res) {
                    vm.total = res.total;
                    vm.players = res.players;
                });
            }
        }
    });
});