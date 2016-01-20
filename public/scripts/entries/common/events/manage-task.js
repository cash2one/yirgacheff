/**
 * Created by Admin on 2016/1/18.
 */
'use strict';

var app = require('../../../common/app');
require('../../../common/formvalidator');

$(document).ready(function () {
    app = app();

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
    $("#addTask").click(function(){
        $("#taskModal").modal("show");
    });

    $("#taskScore").validate(function ($form, data) {
        $.post('/api/v1/events/' + data.eventId + '/tasks', data).then(function (event) {
            app.notify.success("添加任务成功");
        });

    });
});
