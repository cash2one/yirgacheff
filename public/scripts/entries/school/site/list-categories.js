'use strict';

require('datatables');
require('../../../common/formvalidator');
var app = require('../../../common/app');
var notify = require('../../../common/notify');

$(document).ready(function () {
    app();
    //表格
    var $categoryForm = $("#categoryForm");
    var rawTable = $('#category-list');
    var dataTable = rawTable.DataTable({
        'bAutoWidth': false,
        'bSort': false,
        'language': {
            'url': '/js/lib/plugins/dataTable/Chinese.lang'
        },
        'ajax': {url: '/api/v1/categories', dataSrc: ''},
        'order': [[0, "asc"]],
        'rowId': '_id',
        'columns': [
            {'data': 'order'},
            {'data': 'name'},
            {'data': 'postCount'},
            {
                'data': null,
                'defaultContent': '<a class="f-info m-r-xs edit"><i class="fa fa-pencil"></i></a>' +
                '<a class="f-info m-r-xs detail"><i class="fa fa-file-text-o"></i></a>' +
                '<a class="f-pink delete"><i class="fa fa-trash-o"></i></a>'
            }
        ],
        "aoColumnDefs": [
            {
                sDefaultContent: '',
                aTargets: ['_all']
            }
        ]
    });

    $("#add-category-btn").click(function () {
        $categoryForm[0].reset();
        $("#categoryModal").modal("show");
    });

    $categoryForm.validate(function ($form, data) {
        var isModify = !!data._id;
        if (isModify) {
            $.ajax({
                url: '/api/v1/categories/' + data._id,
                method: 'PUT',
                data: data
            }).then(function () {
                dataTable
                    .row("#" + data._id)
                    .data(data)
                    .draw();
                notify.success("修改分类成功");
                $("#categoryModal").modal("hide");
            });
        } else {
            delete data['_id'];
            $.post('/api/v1/categories', data).then(function (data) {
                dataTable.row.add(data).draw();
                notify.success("添加分类成功");
                $("#categoryModal").modal("hide");
            });
        }
    });

    rawTable.on('click', '.edit', function () {
        var category = dataTable.row($(this).parents('tr')).data();
        $categoryForm.renderForm(category);
        $("#categoryModal").modal("show");
    });

    rawTable.on('click', '.delete', function () {
        var category = dataTable.row($(this).parents('tr')).data();
        var self = $(this);
        if (confirm("确定要删除分类 " + category.name + " ?")) {
            var url = '/api/v1/categories/' + category._id;
            $.ajax({
                url: url,
                method: 'DELETE'
            }).then(function () {
                dataTable
                    .row(self.parents('tr'))
                    .remove()
                    .draw();
                notify.success("删除分类成功");
            })
        }
    });

    rawTable.on('click', '.detail', function () {
        var category = dataTable.row($(this).parents('tr')).data();
        var categoryId = category._id;
        self.location.href = '/school/posts?category=' + categoryId;
    });

});
