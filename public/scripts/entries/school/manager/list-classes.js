'use strict';

require('datatables');
var app = require('../../../common/app');
var layer = require('../../../common/layerWrapper');

$(document).ready(function () {
    var rawTable = $('#teacher-list');
    var dataTable = rawTable.DataTable({
        'bAutoWidth': false,
        'bSort': false,
        'language': {
            'url': '/js/lib/plugins/dataTable/Chinese.lang'
        }
    });

    //转让班级
    rawTable.on('click', '.exchange-btn', function () {
        var classId = $(this).parents('tr').attr('id'),
            url = '/api/v1/classes/' + classId + '/changeOwner';
        layer.ajaxForm({
            title: '转让班级',
            container: 'exchange-class',
            form: 'exchange-form',
            validator: function (data) {
                if (data.username === '') {
                    return '请输入转让老师工号';
                }
            },
            ajax: {
                url: url,
                type: 'PUT',
                success: function (data, done) {
                    done();
                }
            }
        });
    });
});

