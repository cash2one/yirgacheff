/**
 * Created by Admin on 2016/1/18.
 */
'use strict';

var app = require('../../../common/app');
var Vue = require('vue');
require('../../../common/formvalidator');

$(document).ready(function () {
    app = app();

    Vue.component('task-modal', {
        props: ['task'],
        template: '#taskModalTemplate'
    });

    Vue.component('task-item', {
        props: ['task'],
        template: '#taskTemplate'
    });

    new Vue({
        data: {
            tasks: []
        },
        el: '#taskApp'
    });

    //$("[name='task']").bootstrapSwitch();
    //
    //$('input[name="task"]').on('switchChange.bootstrapSwitch', function (event, state) {
    //    if (state) {
    //        $(".tips").fadeIn();
    //        $("#taskScore").fadeOut();
    //    }
    //    else {
    //        $(".tips").fadeOut();
    //        $("#taskScore").fadeIn();
    //    }
    //});
    $("#addTask").click(function () {
        $("#taskModal").modal("show");
    });

    $("#taskScore").validate(function ($form, data) {
        $.post('/api/v1/events/' + data.eventId + '/tasks', data).then(function (event) {
            app.notify.success("添加任务成功");
        });

    });
});
