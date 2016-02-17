/**
 * Created by Admin on 2016/1/27.
 */
'use strict';

import Vue from 'vue';
import app from  '../../../common/app';
import notify from '../../../common/notify';
import dateRange from '../../../components/DateRange';
import vEditor from '../../../components/Editor';
import vUpload from '../../../components/upload';
import vIcon from '../../../components/iconfont';

$(document).ready(function() {
    
    Vue.filter('visit', function (value) {
      return GLOBAL.visitUrl + '/' + value;
    });
    //富编辑器渲染
    var vm = new Vue({
        el: '#voteApp',
        components: {
            vEditor,
            dateRange,
            vUpload,
            vIcon
        },
        data: {
            loading: false,
            vote: {
                template: 'vote',
                title: '',
                startTime: '',
                endTime: '',
                covers: [],
                prize: '', 
                participation: '',
                explanation: '',
                theme: 'default',
                requireFollow: true,
                followTip: '',
                voteEnroll: true
            }
        },
        methods:{
            addCover:function addCover(res) {
              this.vote.covers.push(res.key);
            },
            deleteCover:function deleteCover(index) {
              this.vote.covers.splice(index,1);
            },
            submit:function submit() {
                var vote = this.$data.vote;
                if(vote.title === ""){
                    return notify.danger("投票标题不能为空");
                }
                if(vote.startTime === "" || vote.endTime === ""){
                    return notify.danger("必须设置投票时间");
                }
                if(vote.covers.length === 0){
                    return notify.danger("至少设置一张页头图片");
                }
                if(vote.requireFollow && vote.followTip === ""){
                    return notify.danger("关注说明不能为空");
                }
                if(vote.prize === ""){
                    return notify.danger("奖项设置不能为空");
                }
                if(vote.participation === ""){
                    return notify.danger("参与说明不能为空");
                }
                vote.coverImage = vote.covers[0];
                this.loading = true;
                $.post('/api/v1/events', vote).then(function (event) {
                    self.location.href = "/school/events/manage/" + event._id.toString();
                });
            }
        }
    });
});