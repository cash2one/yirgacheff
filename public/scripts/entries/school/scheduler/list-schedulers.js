/**
 * Created by Frank on 15/6/5.
 */
'use strict';

require('../../../common/formvalidator');
var app = require('../../../common/app');
var notify = require('../../../common/notify');
var datepicker = require('../../../common/datetimepicker');

$(document).ready(function () {
    app();
    var calendar = $('#calendar');
    var $scheduleForm = $('#scheduleForm');
    datepicker.timeRange({
        start: "start",
        end: "end"
    });
    var event;

    calendar.fullCalendar({
        editable: true,
        eventLimit: 4,
        contentHeight: 650,
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek'
        },
        events: {
            url: '/api/v1/schedules',
            cache: true
        },
        eventClick: function (calEvent, jsEvent, view) {
            $scheduleForm.renderForm({
                title: calEvent.title,
                start: calEvent.start.format('YYYY-MM-DD HH:mm'),
                end: calEvent.end.format('YYYY-MM-DD HH:mm')
            });
            $('#scheduleId').val(calEvent._id);
            $('.more-menu').show();
            $("#scheduleModal").modal("show");
            event = calEvent;
        },
        lazyFetching: true,
        timeFormat: '',
        timezone: 'local',
        selectable: true,
        select: function (start, end) {
            $scheduleForm[0].reset();
            $('#start').val(start.hour(8).format('YYYY-MM-DD HH:mm'));
            $('#end').val(start.hour(9).format('YYYY-MM-DD HH:mm'));
            $('.more-menu').hide();
            $("#scheduleModal").modal("show");
        }
    });

    $scheduleForm.validate(function ($form, data) {
        var isModify = !!data.scheduleId;
        if (isModify) {
            $.ajax({
                url: '/api/v1/schedules/' + data.scheduleId,
                type: 'PUT',
                data: data
            }).then(function (data) {
                event.title = data.title;
                event.start = data.start;
                event.end = data.end;
                calendar.fullCalendar('updateEvent', event);
                notify.success("修改日程成功");
                $("#scheduleModal").modal("hide");
            });
        } else {
            $.post('/api/v1/schedules', data).then(function (data) {
                calendar.fullCalendar('renderEvent', data, false);
                notify.success("添加日程成功");
                $("#scheduleModal").modal("hide");
            });
        }
    });


    $('.del-btn').click(function () {
        if (confirm("确认删除日程?")) {
            var scheduleId = $('#scheduleId').val();
            var url = '/api/v1/schedules/' + scheduleId;
            $.ajax({
                url: url,
                method: 'DELETE'
            }).then(function () {
                notify.success("删除日程成功");
                $("#scheduleModal").modal("hide");
                calendar.fullCalendar('removeEvents', [scheduleId]);
                $('#scheduleId').val('');
            });
        }
    });

});
