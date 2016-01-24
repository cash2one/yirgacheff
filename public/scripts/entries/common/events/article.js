/**
 * Created by Admin on 2016/1/9.
 */
'use strict';
require('../../../common/formvalidator');
var app = require('../../../common/app');
var upload = require('../../../common/uploadifive');
var richEditor = require('../../../common/richEditor');
var weixinEditor = require('../../../common/weixinEditor');
var Vue = require('vue');

$(document).ready(function () {
    app();
    var vm = new Vue({
        data: {
            loading: false
        },
        el: '#articleApp'
    });

    //富编辑器渲染
    var editor = richEditor.render('content');
    //初始化微信编辑器
    weixinEditor({editor: editor});
    editor.ready(function () {
        var hideContent = $("#hideContent");
        if (hideContent.length > 0) {
            editor.setContent(hideContent.val());
        }
    });

    upload({
        file: 'imageUpload',
        done: function (file) {
            $('#indexImage').attr('src', file.path);
            $('#coverImage').val(file.key);
        }
    });

    $("#articleForm").validate(function ($form, data) {
        data.template = 'article';
        vm.loading = true;
        $.post('/api/v1/events', data).then(function (event) {
            self.location.href = "/school/events/manage/" + event._id.toString();
        });
    });

});

