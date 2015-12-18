'use strict';

requirejs(['jquery', 'leftMenu', 'headMenu', 'easyDropDown', 'datatables'],
    function ($, leftMenu, headMenu) {
        leftMenu.init();
        headMenu.init();
        var $selectedClass = $('#class-list');
        var jqTable = $('#students-list');
        var dataTable = jqTable.DataTable({
            'bAutoWidth': true,
            "bSort": false,
            'language': {
                'url': '/js/lib/plugins/dataTable/Chinese.lang'
            },
            'ajax': {
                url: '/api/v1/classes/' + $selectedClass.val() + '/students',
                dataSrc: ''
            },
            'order': [[1, "desc"]],
            'columns': [
                {'data': 'displayName'},
                {'data': 'username'},
                {'data': 'gender'},
                {'data': 'phone'},
                {
                    'data': null,
                    'defaultContent': '<a class="btn btn-info btn-xs btn-custom detail">详情</a>'
                }
            ]
        });
        jqTable.on('click', '.detail', function () {
            var student = dataTable.row($(this).parents('tr')).data();
            self.location.href = "/teacher/connections/" + student._id;
        });
        $selectedClass.change(function () {
            var url = '/api/v1/classes/' + $(this).val() + '/students';
            dataTable.ajax.url(url).load();
        });
    });
