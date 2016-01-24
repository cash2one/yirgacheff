'use strict';

var app = require('../../../common/app');

$(document).ready(function () {
    app = app();

    var jqTable = $('#homework-list');
    var dataTable = jqTable.DataTable({
        'bAutoWidth': false,
        "bSort": false,
        'language': {
            'url': '/js/lib/plugins/dataTable/Chinese.lang'
        }
    });
    jqTable.on('click', '.delete', function () {
        var homeworkId = $(this).closest('tr').attr('id');
        if (confirm("确定删除作业?")) {
            $.ajax({
                url: '/api/v1/homework/' + homeworkId,
                method: 'DELETE'
            }).then(function () {
                dataTable.row("#" + homeworkId).remove().draw();
                app.notify.success("删除作业成功");
            });
        }
    });
});

