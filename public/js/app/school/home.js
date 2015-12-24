'use strict';


requirejs(['jquery', 'restfulClient', 'easyDropDown', 'headMenu', 'leftMenu', 'utils', 'underscore', 'highcharts', 'highcharts-theme'],
    function ($, $http, easyDropDown, headMenu, leftMenu, utils, _) {
        headMenu.init();
        leftMenu.init();
        // 学生数
        $http.get('/api/v1/statics/students/count', function (data) {
            $('#student-count').html(data);
        });
        // 班级数
        $http.get('/api/v1/statics/classes/count', function (data) {
            $('#class-count').html(data);
        });
        // 教师数
        $http.get('/api/v1/statics/teachers/count', function (data) {
            $('#teacher-count').html(data);
        });
        // 出题排行榜
        $http.get('/api/v1/statics/teachers/quizContributionRank', function (data) {
            var template = _.template($("#quizContributionRankTemplate").html());
            $('#teacherRankView').html(template({rankList: data}));
        });

        $http.get('/api/v1/statics/students/scoreDistribution', function (data) {
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
                        text: '人数'
                    }
                },
                xAxis: {
                    categories: data.categories,
                    title: {
                        text: '积分分布'
                    }
                },
                credits: {
                    enabled: false
                },
                series: [{
                    name: '人数',
                    data: data.series
                }]
            });
        });

        // 教师教学生数量排行及数量分布
        $http.get('/api/v1/statics/teachers/classCountOfTaughtRank',
            function (data) {
                var template = _.template($("#classesCountOfTaughtRankTemplate").html());
                $('#classesCountOfTaughtRank').html(template({rankList: data.teachers}));
                $('#classesCountOfTaughtBar').highcharts({
                    title: {
                        text: ''
                    },
                    tooltip: {
                        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                    },
                    plotOptions: {
                        pie: {
                            allowPointSelect: true,
                            cursor: 'pointer',
                            dataLabels: {
                                enabled: true,
                                format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                            }
                        }
                    },
                    series: [{
                        type: 'pie',
                        name: '作业',
                        data: data.series
                    }]
                });
            });

        //招生人数统计
        $('#enrolStudentChart').highcharts({
            title: {
                text: '招生人数统计',
                style: {
                    fontFamily: '微软雅黑'
                }
            },
            xAxis: {
                categories: []
            },
            yAxis: {
                title: {
                    text: '人数',
                    style: {
                        fontFamily: '微软雅黑'
                    }
                }
            },
            series: [{
                type: 'column',
                name: '男生',
                data: []
            }, {
                type: 'column',
                name: '女生',
                data: []
            }, {
                type: 'spline',
                name: '总数',
                data: []
            }]
        });
        var enrolTimeRange = $('#enrolTimeRange');
        enrolTimeRange.change(function () {
            var type = $(this).val();
            var chart = $('#enrolStudentChart').highcharts();
            chart.showLoading();

            $http.get('/api/v1/statics/students/enrolStudentsCount', {
                type: type
            }, function (data) {
                var series = data.series;
                chart.series[0].setData(series[0]);
                chart.series[1].setData(series[1]);
                chart.series[2].setData(series[2]);
                chart.xAxis[0].setCategories(data.categories);
                chart.redraw();
                chart.hideLoading();
            })
        });
        enrolTimeRange.trigger('change');
    });

