'use strict';
require('datatables');
var app = require('../../../common/app');

$(document).ready(function () {
    function formatDate(data) {
        var date = new Date(data);
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDay();
        return year + '-' + month + '-' + day;
    }

    var jqTable = $('#library-list');
    var dataTable = jqTable.DataTable({
        'bAutoWidth': true,
        'bSort': false,
        'language': {
            'url': '/js/lib/plugins/dataTable/Chinese.lang'
        },
        'processing': true,
        'serverSide': true,
        'ajax': {
            url: '/api/v1/quizzes',
            dataSrc: 'data'
        },
        'order': [[1, "desc"]],
        'columns': [
            {'data': 'title'},
            {'data': 'title'},
            {'data': 'creatorDisplayName'},
            {'data': 'createdTime'},
            {'data': 'usage'},
            {'data': '_id'}
        ],
        'columnDefs': [
            {
                'targets': [3],
                'render': function (data) {
                    return formatDate(data);
                }
            },
            {
                'targets': [0],
                'render': function (data, type, row, meta) {
                    return meta.row + 1;
                }
            },
            {
                'targets': [5],
                'render': function (data, type, row, meta) {
                    return '<a class="btn btn-info btn-xs btn-custom detail" href=" /teacher/quizzes/' + data + '">查看</a> ' +
                        '<a class="btn btn-default btn-xs btn-custom delete-btn" href="/teacher/homework/create?quizId=' + data + '">使用</a>';
                }
            }
        ]
    });

});
