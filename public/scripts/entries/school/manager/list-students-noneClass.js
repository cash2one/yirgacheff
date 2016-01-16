'use strict';

require('datatables');
var app = require('../../../common/app');

$(document).ready(function () {
    var jqTable = $('#students-list');

    var dataTable = jqTable.DataTable({
        'bAutoWidth': true,
        'bSort': false,
        'language': {
            'url': '/js/lib/plugins/dataTable/Chinese.lang'
        },
        'ajax': {
            url: '/api/v1/classes/empty/students',
            dataSrc: ''
        },
        rowId: "_id",
        'order': [[1, "desc"]],
        'columns': [
            {'data': 'displayName'},
            {'data': 'username'},
            {'data': 'password'},
            {'data': 'gender'},
            {'data': 'phone'},
            {
                'data': null,
                'defaultContent': '<a class="f-info m-r-xs detail" title="详情"><i class="icon icon-xiangqing"></i></a>' +
                '<a class="f-pink delete" title="删除"><i class="icon icon-shanchu"></i></a>'
            }
        ]
    });

    jqTable.on('click', '.delete', function () {
        var student = dataTable.row($(this).parents('tr')).data();
        if (confirm("确定删除学生" + student.displayName + "?")) {
            var url = '/api/v1/students/' + student._id;
            $.ajax({
                url: url,
                method: 'DELETE'
            }).then(function () {
                dataTable
                    .row("#" + student._id)
                    .remove()
                    .draw();
            })

        }
    });

    jqTable.on('click', '.detail', function () {
        var student = dataTable.row($(this).parents('tr')).data();
        self.location.href = "/school/students/" + student._id;
    });
});

