'use strict';

require('datatables');
require('../../../common/formvalidator');
var notify = require('../../../common/notify');
var app = require('../../../common/app');


$(document).ready(function () {
    app();
    var $table = $('#teacher-list');
    var $teacherForm = $('#teacherForm');
    var dataTable = $table.DataTable({
        'bAutoWidth': false,
        'bSort': false,
        'language': {
            'url': '/js/lib/plugins/dataTable/Chinese.lang'
        },
        'ajax': {
            url: '/api/v1/teachers',
            dataSrc: ''
        },
        'rowId': '_id',
        'order': [[1, "desc"]],
        'columns': [
            {'data': 'displayName'},
            {'data': 'username'},
            {'data': 'password'},
            {'data': 'contact'},
            {'data': 'department'},
            {
                'data': null,
                'defaultContent': '<a class="btn btn-info btn-xs btn-custom edit" >修改</a>&nbsp;&nbsp;' +
                '<a class="btn btn-pink btn-xs btn-custom delete" data-toggle="confirmation">禁用</a>&nbsp;&nbsp;'
            }
        ]
    });

    $teacherForm.validate(function ($form, data) {
        var isModify = !!data._id;
        $.post('/api/v1/teachers', data).then(function (teacher) {
            if (isModify) {
                notify.success("修改教师成功");
                dataTable.row("#" + data._id).data(teacher).draw();
            } else {
                notify.success("添加教师成功");
                dataTable.row.add(teacher).draw();
            }
            $("#teacherModal").modal("hide");
            $teacherForm[0].reset();
        });
    });

    $table.on('click', '.delete', function () {
        var teacherId = $(this).parents('tr').attr("id");
        if (confirm("确定禁用教师?")) {
            $.ajax({
                url: "/api/v1/teachers/" + teacherId,
                method: "DELETE"
            }).then(function (res) {
                notify.success("禁用教师成功");
                dataTable
                    .row("#" + teacherId)
                    .remove()
                    .draw();
            });
        }
    });


    $table.on('click', '.edit', function () {
        var teacher = dataTable.row($(this).parents('tr')).data();
        $teacherForm.renderForm(teacher);
        $("#teacherModal").modal("show");
    });

});
