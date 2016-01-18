'use strict';
require('datatables');
var app = require('../../../common/app');
var strftime = require('strftime');
var notify = require('../../../common/notify');

$(document).ready(function () {
    app();

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
                    return '<a class="f-info m-r-xs detail" title="详情" href=" /school/quizzes/' + data + '"><i class="icon icon-xiangqing"></i></a> ' +
                        '<a class="f-pink delete-btn" title="删除" id=' + data + '><i class="fa fa-trash-o f-s-20"></i></a>';
                }
            }
        ]
    });

    jqTable.on('click', '.delete-btn', function () {
        var self = $(this);
        var quizId = self.attr('id');
        if (confirm("确定要删除?")) {
            var url = '/api/v1/quizzes/' + quizId;
            $.ajax({
                url: url,
                method: 'DELETE'
            }).then(function () {
                notify.success("删除题目成功");
                dataTable
                    .row(self.parents('tr'))
                    .remove()
                    .draw();
            });
        }

    });

});

