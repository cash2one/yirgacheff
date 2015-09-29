'use strict';

requirejs(['jquery', 'restfulClient', 'leftMenu', 'headMenu', 'layerWrapper', 'easyDropDown', 'datatables'],
    function ($, $http, leftMenu, headMenu, layer) {

        leftMenu.init();
        headMenu.init();
        var jqTable = $('#students-list');

        var dataTable = jqTable.DataTable({
            'bAutoWidth': true,
            'bSort': false,
            'language': {
                'url': '/js/lib/plugins/dataTable/Chinese.lang'
            },
            'ajax': {
                url: '/api/v1/noneClass/students',
                dataSrc: ''
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
                    'defaultContent': '<a class="btn-small a-btn-blue detail" style="width:64px" >查看</a>&nbsp;&nbsp;' +
                    '<a class="btn-small a-btn-red delete">删除</a>'
                }
            ]
        });

        jqTable.on('click', '.delete', function () {
            var student = dataTable.row($(this).parents('tr')).data();
            var self = $(this);
            layer.confirm('确定删除学生 ' + student.displayName + ' ?', function () {
                var url = '/api/v1/students/' + student._id;
                $http.del(url, function () {
                    dataTable
                        .row(self.parents('tr'))
                        .remove()
                        .draw();
                });
            });
        });

        jqTable.on('click', '.detail', function () {
            var student = dataTable.row($(this).parents('tr')).data();
            self.location.href = "/school/students/" + student._id;
        });


    });
