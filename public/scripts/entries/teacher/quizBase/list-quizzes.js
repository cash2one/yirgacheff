'use strict';
require('datatables');
var strftime = require('strftime');
var app = require('../../../common/app');

$(document).ready(function () {
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
                    return strftime('%F', new Date(data));
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
                    return '<a class="f-info detail" href=" /teacher/quizzes/' + data + '"><i class="iconfont icon-xiangqing"></i></a> ';
                }
            }
        ]
    });

});
