'use strict';

require('datatables');
var notify = require('../../../common/notify');
var app = require('../../../common/app');

$(document).ready(function () {
    var rawTable = $('#teacher-list');
    var dataTable = rawTable.DataTable({
        'bAutoWidth': false,
        'bSort': false,
        'language': {
            'url': '/js/lib/plugins/dataTable/Chinese.lang'
        },
        'ajax': {
            url: '/api/v1/teachers/disabled',
            dataSrc: ''
        },
        rowId: "_id",
        'order': [[1, "desc"]],
        'columns': [
            {'data': 'displayName'},
            {'data': 'username'},
            {'data': 'password'},
            {'data': 'contact'},
            {'data': 'department'},
            {
                'data': null,
                'defaultContent': '<a class="f-default enable" title="启用"><i class="icon icon-qiyongcaozuoyuan"></i></a>'
            }
        ]
    });

    rawTable.on('click', '.enable', function () {
        var teacher = dataTable.row($(this).parents('tr')).data();
        var url = '/api/v1/teachers/' + teacher._id + '/enable';
        $.ajax({
            url: url,
            method: "PUT"
        }).then(function () {
            notify.success("启用教师成功");
            dataTable
                .row(teacher._id)
                .remove()
                .draw();
        });
    });
});
