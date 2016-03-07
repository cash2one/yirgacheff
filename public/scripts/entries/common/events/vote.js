/**
 * Created by Admin on 2016/1/27.
 */
'use strict';

import Vue from 'vue';
import _ from 'underscore';
import app from  '../../../common/app';
import notify from '../../../common/notify';
import dateRange from '../../../components/DateRange';
import vUpload from '../../../components/upload';
import vIcon from '../../../components/iconfont';

$(document).ready(function () {

    Vue.filter('visit', function (value) {
        return GLOBAL.visitUrl + '/' + value;
    });
    var voteData = window.vote || {};
    if (voteData.startTime) {
        voteData.startTime = voteData.startTime.substr(0, 10);
    }
    if (voteData.endTime) {
        voteData.endTime = voteData.endTime.substr(0, 10);
    }
    //富编辑器渲染
    new Vue({
        el: '#voteApp',
        components: {
            dateRange,
            vUpload,
            vIcon
        },
        data: {
            loading: false,
            vote: _.assign({
                template: 'vote',
                title: '',
                startTime: '',
                endTime: '',
                slides: [],
                prize: '',
                participation: '',
                explanation: '',
                theme: 'default',
                requireFollow: true,
                followTip: '',
                voteEnroll: true
            }, voteData)
        },
        methods: {
            addCover: function addCover(res) {
                this.vote.slides.push(res.key);
            },
            deleteCover: function deleteCover(index) {
                this.vote.slides.splice(index, 1);
            },
            submit: function submit() {
                var vote = this.$data.vote;
                if (vote.title === "") {
                    return notify.danger("投票标题不能为空");
                }
                if (vote.startTime === "" || vote.endTime === "") {
                    return notify.danger("必须设置投票时间");
                }
                if (vote.slides.length === 0) {
                    return notify.danger("至少设置一张页头图片");
                }
                if (vote.requireFollow && vote.followTip === "") {
                    return notify.danger("关注说明不能为空");
                }
                if (vote.prize === "") {
                    return notify.danger("奖项设置不能为空");
                }
                if (vote.participation === "") {
                    return notify.danger("参与说明不能为空");
                }
                vote.coverImage = vote.slides[0];
                this.loading = true;
                if (vote._id) {
                    $.ajax({
                        url: `/api/v1/events/${vote._id}`,
                        method: 'PUT',
                        data: vote
                    }).then(function (res) {
                        notify.success("修改投票成功");
                    });
                } else {
                    $.post('/api/v1/events', vote).then(function (event) {
                        self.location.href = "/school/events/manage/" + event._id.toString();
                    });
                }
            }
        }
    });
});