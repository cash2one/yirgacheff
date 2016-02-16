/**
 * Created by Admin on 2016/1/27.
 */
'use strict';
var upload = require('../../../common/uploadifive');

import app from  '../../../common/app';
import Vue from 'vue';
import dateRange from '../../../components/DateRange';
import datePicker from '../../../components/DatePicker';
import vEditor from '../../../components/Editor';
import vUpload from '../../../components/upload';
import vIcon from '../../../components/iconfont';


$(document).ready(function() {
    app();
    Vue.filter('visit', function (value) {
      return GLOBAL.visitUrl + '/' + value;
    });
    //富编辑器渲染
    var vm = new Vue({
        el: '#voteApp',
        components: {
            vEditor,
            dateRange,
            datePicker,
            vUpload,
            vIcon
        },
        data: {
            loading: false,
            vote:{
                title:'',
                covers:[],
                customs:[{
                    label:'奖项设置',
                    content:''
                }],
                requireFollow:true,
                isEnroll: true
            }
        },
        methods:{
            addCover:function addCover(res) {
              this.vote.covers.push(res.key);
            }
        }
    });

});