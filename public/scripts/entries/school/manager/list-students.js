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
        'processing': true,
        'serverSide': true,
        'ajax': {
            url: '/api/v1/students',
            dataSrc: 'data'
        },
        'order': [[1, "desc"]],
        'columns': [
            {'data': 'displayName'},
            {'data': 'username'},
            {'data': 'password'},
            {'data': 'gender'},
            {'data': 'onSchool'},
            {'data': 'grade'},
            {
                'data': null,
                'defaultContent': '<a class="btn btn-info btn-xs btn-custom detail" >查看</a>'
            }
        ],
        "aoColumnDefs": [
            {
                sDefaultContent: '',
                aTargets: ['_all']
            }
        ]
    });

    $('#teacher-list').change(function () {
        var selectTeacher = $(this).val();
        if (selectTeacher === "") {
            dataTable.ajax.url('/api/v1/students').load();
            $('#class-list').html("<option>请选择</option>").prop("disabled", true);
            $('#class-list-frame').hide();
        } else {
            dataTable.ajax.url('/api/v1/teachers/' + selectTeacher + '/students').load();
            $.get('/api/v1/teachers/' + selectTeacher + '/classes', function (classes) {
                var options = '<option value="">选择班级</option>';
                for (var i = 0; i < classes.length; i++) {
                    var clazz = classes[i];
                    options += '<option value="' + clazz._id + '">' + clazz.className + '</option>';
                }
                $('#class-list-frame').show();
                $('#class-list').html(options).prop("disabled", false);
            });
        }
    });
    $('#class-list').change(function () {
        var selectClass = $(this).val();
        if (!selectClass || selectClass === "") {
            dataTable.ajax.url('/api/v1/teachers/' + $('#teacher-list').val() + '/students').load();
        } else {
            dataTable.ajax.url('/api/v1/classes/' + selectClass + '/students').load();
        }
    });

    jqTable.on('click', '.detail', function () {
        var student = dataTable.row($(this).parents('tr')).data();
        window.open('/school/students/' + student._id, "_self");
    });


});
