_ = require 'underscore'
app = require '../../common/app'
require '../../common/highcharts'

$ ->
#app 初始化
  app()
  #学生数
  $.get('/api/v1/statics/students/count').then (data) ->
    $('#student-count').html data

  #班级数
  $.get('/api/v1/statics/classes/count').then (data) ->
    $('#class-count').html data

  #教师数
  $.get('/api/v1/statics/teachers/count').then (data) ->
    $('#teacher-count').html(data)

  # 出题排行榜
  $.get('/api/v1/statics/teachers/quizContributionRank').then (data) ->
    template = _.template($("#quizContributionRankTemplate").html());
    $('#teacherRankView').html(template({rankList: data}));


  #积分分布
  $.get('/api/v1/statics/students/scoreDistribution').then (data)->
    $('#scoreBar').highcharts({
      chart: {
        type: 'bar'
      },
      title: {
        text: ''
      },
      yAxis: {
        min: 0,
        title: {
          text: '\u4eba\u6570' #人数
        }
      },
      xAxis: {
        categories: data.categories,
        title: {
          text: '\u79ef\u5206\u5206\u5e03' #积分分布
        }
      },
      credits: {
        enabled: false
      },
      series: [{
        name: '\u4eba\u6570', #人数
        data: data.series
      }]
    })


  #教师教学生数量排行及数量分布
  $.get('/api/v1/statics/teachers/classCountOfTaughtRank').then (data) ->
    template = _.template($("#classesCountOfTaughtRankTemplate").html())
    $('#classesCountOfTaughtRank').html(template({rankList: data.teachers}))
    $('#classesCountOfTaughtBar').highcharts
      title:
        text: ''
      tooltip:
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'

      plotOptions:
        pie:
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels:
            enabled: true,
            format: '<b>{point.name}</b>: {point.percentage:.1f} %'

      series: [{
        type: 'pie',
        name: '\u4f5c\u4e1a', #作业
        data: data.series
      }]


  #招生人数统计
  $('#enrolStudentChart').highcharts({
    title: {
      text: '\u62db\u751f\u4eba\u6570\u7edf\u8ba1', #招生人数统计
      style: {
        fontFamily: '\u5fae\u8f6f\u96c5\u9ed1' #微软雅黑
      }
    },
    xAxis: {
      categories: []
    },
    yAxis: {
      title: {
        text: '\u4eba\u6570', #人数
        style: {
          fontFamily: '\u5fae\u8f6f\u96c5\u9ed1' #微软雅黑
        }
      }
    },
    series: [{
      type: 'column',
      name: '\u7537\u751f', #男生
      data: []
    },
      {
        type: 'column',
        name: '\u5973\u751f', #女生
        data: []
      },
      {
        type: 'spline',
        name: '\u603b\u6570', #总数
        data: []
      }]
  })

  enrolTimeRange = $('#enrolTimeRange')
  enrolTimeRange.change ()->
    type = $(this).val();
    chart = $('#enrolStudentChart').highcharts()
    chart.showLoading();
    $.get '/api/v1/statics/students/enrolStudentsCount', {type: type}, (data)->
      series = data.series;
      chart.series[0].setData(series[0])
      chart.series[1].setData(series[1])
      chart.series[2].setData(series[2])
      chart.xAxis[0].setCategories(data.categories)
      chart.redraw()
      chart.hideLoading()
  enrolTimeRange.trigger('change');

