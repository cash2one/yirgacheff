'use strict';

require('datatables');
var app = require('../../../common/app');
var layer = require('../../../common/layerWrapper');
var $http = require('../../../common/restfulClient');

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
        'order': [[1, "desc"]],
        'columns': [
            {'data': 'displayName'},
            {'data': 'username'},
            {'data': 'password'},
            {'data': 'contact'},
            {'data': 'department'},
            {
                'data': null,
                'defaultContent': '<a class="btn-small a-btn-blue enable">启用</a>'
            }
        ]
    });

    rawTable.on('click', '.enable', function () {
        var teacher = dataTable.row($(this).parents('tr')).data();
        var self = $(this);
        layer.confirm('确定要启用教师 ' + teacher.displayName + ' ?', function () {
            var url = '/api/v1/teachers/' + teacher._id + '/enable';
            $http.put(url, function () {
                dataTable
                    .row(self.parents('tr'))
                    .remove()
                    .draw();
            });
        });
    });
});
