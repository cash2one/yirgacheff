'use strict';
require('datatables');
var app = require('../../../common/app');

$(document).ready(function () {
    app();
    var jqTable = $('#students-list');
    var dataTable = jqTable.DataTable({
        'bAutoWidth': true,
        'bSort': false,
        'language': {
            'url': '/js/lib/plugins/dataTable/Chinese.lang'
        }
    });

    jqTable.on('click', '.detail', function () {
        var student = dataTable.row($(this).parents('tr')).data();
        window.open('/school/students/' + student._id);
    });

    $('#download-btn').click(function () {
        var classId = $("#classId").val();
        var url = '/api/v1/classes/' + classId + '/students/doc';
        window.open(url);
    });
});

