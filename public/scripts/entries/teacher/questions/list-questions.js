'use strict';

require('datatables');
var strftime = require('strftime');
var app = require('../../../common/app');
var notify = require('../../../common/notify');


$(document).ready(function () {
    app();
    //全局变量
    var allStudent;

    function getAllStudent() {
        var url = "/api/v1/teachers/" + GLOBAL.user._id + "/students";
        $.ajax({
            type: "GET",
            url: url,
            async: false,
            success: function (data) {
                allStudent = data;
            }
        });
    }


    //截取字符串，多余的部分用...代替
    function setString(str, len) {
        if (str.length > len) {
            str = str.substr(0, len) + '...';
        }
        return str;
    }

    //
    var $questOpts = $('.quest-opts-area');
    $questOpts.on('click', '.item>a', function () {
        var state = $(this).data('id');
        $(this).parent().addClass('selected');
        $(this).parent().siblings().removeClass('selected');
        table.ajax.url('/api/v1/questions?state=' + state).load(function () {
            if (document.getElementById('myStudent').checked) {
                filterMyStudent();
            }
        });
    });
    //
    function getCurrentState() {
        var href = location.href;
        var arr = href.split('#');
        if (arr[1] === "state1") {
            return 1;
        }
        return 0;
    }

    var $btnSelected = $questOpts.find('.item');
    if (getCurrentState()) {
        $btnSelected.eq(1).addClass('selected');
        $btnSelected.eq(0).removeClass('selected');
    }

    var $table = $('#library-list');
    var table = $table.DataTable({
        'bAutoWidth': true,
        "bSort": false,
        'language': {
            'url': '/js/lib/plugins/dataTable/Chinese.lang'
        },
        'ajax': {
            url: '/api/v1/questions?state=' + getCurrentState(),
            dataSrc: ''
        },
        'order': [[1, "desc"]],
        'columns': [
            {'data': 'questionText'},
            {'data': 'student.displayName'},
            {'data': 'student.username'},
            {'data': 'createdTime'},
            {'data': 'teacher.displayName'},
            {
                'data': null,
                'defaultContent': '<a  class="f-info detail">详情</a>'
            }
        ],
        'columnDefs': [
            {
                'targets': [0],
                'render': function (data, type, row) {
                    data = setString(data, 10);
                    return '<a class="detail">' + data + '</a>';
                }
            },
            {
                'targets': [3],
                'render': function (data, type, row) {
                    return strftime('%F %T',new Date(data));
                }
            },
            {
                'targets': [4],
                'render': function (data, type, row) {
                    return data ? data : '-';
                }
            }
        ]
    });

    //仅看我的学生
    function filterMyStudent() {
        if (!allStudent) {
            getAllStudent();
        }
        var arr = [];
        for (var item in allStudent) {
            arr.push(allStudent[item].username);
        }
        //找到我的学生保存在fliterData中
        var fliterData = table
            .data()
            .filter(function (value, index) {
                return $.inArray(value.student.username, arr) > -1;
            });
        //先清除数据，再将数据渲染
        table.clear().rows.add(fliterData).draw();
    }

    //勾选是否仅看我的学生
    $('.checkbox-que input').click(function () {
        if (document.getElementById('myStudent').checked) {                       //选中处理
            filterMyStudent();
        } else {
            table.ajax.url('/api/v1/questions?state=' + getCurrentState()).load();
        }
    });

    //查看具体的页面
    $table.on('click', '.detail', function () {
        var quest = table.row($(this).parents('tr')).data();
        window.open('/teacher/questions/' + quest._id, "_self");
    });


});

