/**
 * Created by Frank on 15/6/5.
 */
'use strict';

requirejs(['jquery', 'restfulClient', 'leftMenu', 'headMenu', 'layerWrapper', 'moment', 'fullcalendar', 'fullcalendar-zh', 'datepicker', 'jqueryExt', 'jtip'],
    function ($, $http, leftMenu, headMenu, layer, moment) {
        leftMenu.init();
        headMenu.init();
        var calendar = $('#calendar');
        var scheduleForm = $('#schedule-form');
        $('.w-datepicker').datetimepicker({lang: 'ch', format: 'Y-m-d H:i'});
        function formValidator(schedule) {
            if (schedule.start > schedule.end) {
                return '开始时间不能大于结束时间';
            }
            if (schedule.title === '') {
                return '日程内容不能为空';
            }
            return true;
        }

        calendar.fullCalendar({
            editable: true,
            eventLimit:4,
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
                scheduleForm.renderForm({
                    title: calEvent.title,
                    start: calEvent.start.format('YYYY-MM-DD HH:mm'),
                    end: calEvent.end.format('YYYY-MM-DD HH:mm')
                });
                $('#scheduleId').val(calEvent._id);
                $('.del-btn').show();
                layer.ajaxForm({
                    title:'日程修改',
                    container: 'add-scheduler',
                    form: scheduleForm,
                    validator: formValidator,
                    ajax: {
                        type: 'PUT',
                        url: '/api/v1/schedules/' + calEvent._id,
                        success: function (data, done) {
                            calEvent.title = data.title;
                            calEvent.start = moment(data.start);
                            calEvent.end = moment(data.end);
                            calendar.fullCalendar('updateEvent', calEvent);
                            done();
                        }
                    },
                    cancelCallback: function () {
                        calendar.fullCalendar('unselect');
                    }
                });
            },
            eventRender: function (event, element) {
                element.qtip({
                    content: event.title
                });
            },
            lazyFetching: true,
            timeFormat: '',
            timezone: 'local',
            selectable: true,
            select: function (start, end) {
                scheduleForm[0].reset();
                $('#start').val(start.hour(8).format('YYYY-MM-DD HH:mm'));
                $('#end').val(start.hour(9).format('YYYY-MM-DD HH:mm'));
                $('.del-btn').hide();

                layer.ajaxForm({
                    title:'新建日程',
                    container: 'add-scheduler',
                    form: scheduleForm,
                    validator: formValidator,
                    ajax: {
                        type: 'POST',
                        url: '/api/v1/schedules',
                        success: function (data, done) {
                            calendar.fullCalendar('renderEvent', data, false);
                            done();
                        }
                    },
                    cancelCallback: function () {
                        calendar.fullCalendar('unselect');
                    }
                });
            }
        });
        $('.del-btn').click(function () {
            layer.confirm('日程删除后无法恢复，确认要删除该日程吗？',
                function () {
                    var scheduleId = $('#scheduleId').val();
                    var url = '/api/v1/schedules/' + scheduleId;
                    $http.del(url, function () {
                        calendar.fullCalendar('removeEvents', [scheduleId]);
                        layer.closeAll();
                    });
                });
        });
    });

