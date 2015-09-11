'use strict';

requirejs(['jquery', 'restfulClient', 'leftMenu', 'headMenu', 'layerWrapper', 'datatables', 'highcharts'],
    function ($, $http, leftMenu, headMenu, layer) {
        leftMenu.init();
        headMenu.init();
        $('#homework-list').dataTable({
            'bAutoWidth': true,
            "bSort": false,
            'language': {
                'url': '/js/lib/plugins/dataTable/Chinese.lang'
            }
        });
        $('#close-homework-btn').click(function () {
            layer.confirm('确定关闭作业？作业关闭后，您将无法查看未完成的学生作业！', function () {
                var url = '/api/v1/homework/' + $('#homeworkId').val() + '/close';
                $http.put(url, function () {
                    self.location.href = '/teacher/homework/history';
                });
            });
        });

        $('#column-chart').highcharts({
            title: {
                style: {
                    fontFamily: '微软雅黑'
                }
            },
            chart: {
                type: 'column'
            },
            xAxis: {
                categories: []
            },
            yAxis: {
                min: 0,
                title: {
                    text: '人数',
                    style: {
                        fontFamily: '微软雅黑'
                    }
                }
            },
            credits: {
                enabled: false
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y}人</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                }
            },
            series: [{
                name: '错误人数'
            }]
        });

        $http.get('/api/v1/statics/homework/' + $('#homeworkId').val() + '/wrongCount', function (data) {
            var chart = $('#column-chart').highcharts();
            var info = data.info;
            var series = data.series;
            var categories = data.categories;
            chart.setTitle({text: info.title});
            chart.series[0].setData(series);
            chart.xAxis[0].setCategories(categories);
            chart.redraw();
        });

    });
