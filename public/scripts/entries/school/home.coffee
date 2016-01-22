_ = require 'underscore'
app = require '../../common/app'
require '../../common/highcharts'

$ ->
#app 初始化
  app()
  #学生数
  $('#studentCount').load('/api/v1/statics/students/count');
  #班级数
  $('#classCount').load('/api/v1/statics/classes/count')

  #教师数
  $('#teacherCount').load('/api/v1/statics/teachers/count')

  $('#quizCount').load('/api/v1/quizzes/count')


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
    colors: ['#56abe4', '#fb6d9d', '#ffbd4a', '#f7a35c', '#8085e9',
             '#f15c80', '#e4d354', '#8085e8', '#8d4653', '#91e8e1']
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
    credits: {
      enabled:false
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

