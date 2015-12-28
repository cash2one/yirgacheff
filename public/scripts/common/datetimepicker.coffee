require 'bootstrap-datetime-picker/css/bootstrap-datetimepicker.css'
require 'bootstrap-datetime-picker'
require 'bootstrap-datetime-picker/js/locales/bootstrap-datetimepicker.zh-CN'


SETTING =
  language: 'zh-CN'
  weekStart: 1
  autoclose: true
  minView: 1
  format: 'yyyy-mm-dd hh:ii'
  todayBtn: true
  todayHighlight:true

exports.timeRange = (options = {start: "startTime", end: "endTime"})->
  $start = $("#" + options.start)
  $end = $("#" + options.end)
  $start.datetimepicker(SETTING)
  $end.datetimepicker(SETTING)
  $start.datetimepicker().on 'changeDate', (event)->
    if (not $end.val()?) or ($end.val() < $start.val())
      $end.datetimepicker 'update', $start.val()
    $end.datetimepicker('setStartDate', $start.val())

