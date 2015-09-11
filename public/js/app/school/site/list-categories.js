'use strict';
requirejs(['jquery', 'restfulClient', 'leftMenu', 'headMenu', 'validator', 'layerWrapper', 'datatables', 'jqueryExt'],
    function ($, $http, leftMenu, headMenu, validator, layer) {
        leftMenu.init();
        headMenu.init();
        //表格
        var rawTable = $('#category-list');
        var dataTable = rawTable.DataTable({
            'bAutoWidth': false,
            'bSort': false,
            'language': {
                'url': '/js/lib/plugins/dataTable/Chinese.lang'
            },
            'ajax': {url: '/api/v1/categories', dataSrc: ''},
            'order': [[0, "asc"]],
            'columns': [
                {'data': 'order'},
                {'data': 'name'},
                {'data': 'postCount'},
                {
                    'data': null,
                    'defaultContent': '<a class="w-btn-light w-btn-opt edit">修改</a>&nbsp;&nbsp;' +
                    '<a class="w-btn-light w-btn-opt detail">查看</a>&nbsp;&nbsp;' +
                    '<a class="w-btn w-btn-iron-red w-btn-opt delete">删除</a>&nbsp;&nbsp;'
                }
            ],
            "aoColumnDefs": [
                {
                    sDefaultContent: '',
                    aTargets: ['_all']
                }
            ]
        });

        var formValidator = function (data) {
            if (isEmpty(data.name)) {
                return '分类名称不能为空';
            }
            if (isEmpty(data.order) || !validator.isInt(data.order)) {
                return '分类序号不能为空或者非数字';
            }
        };

        $('#add-category-btn').on('click', function () {
            $("#category_form")[0].reset();
            $('#passage-oper').hide();
            layer.ajaxForm({
                container: 'add-category-dialog',
                form: 'category_form',
                validator: formValidator,
                ajax: {
                    type: 'POST',
                    url: '/api/v1/categories',
                    success: function (data, done) {
                        done();
                        dataTable.row.add(data).draw();
                    }
                }
            });
        });

        rawTable.on('click', '.edit', function () {
            var category = dataTable.row($(this).parents('tr')).data();
            var self = $(this);
            var categoryId = category._id;
            $("#category_form").renderForm(category);
            $('#passage-oper').show();
            layer.ajaxForm({
                container: 'add-category-dialog',
                form: 'category_form',
                validator: formValidator,
                ajax: {
                    type: 'PUT',
                    url: '/api/v1/categories/' + categoryId,
                    success: function (data, done) {
                        done();
                        dataTable
                            .row(self.parents('tr'))
                            .data(data)
                            .draw();
                    }
                }
            });
        });

        rawTable.on('click', '.delete', function () {
            var category = dataTable.row($(this).parents('tr')).data();
            var self = $(this);
            layer.confirm('确定要删除分类 ' + category.name + ' ?', function () {
                var url = '/api/v1/categories/' + category._id;
                $http.del(url, function () {
                    dataTable
                        .row(self.parents('tr'))
                        .remove()
                        .draw();
                });
            });
        });

        rawTable.on('click', '.detail', function () {
            var category = dataTable.row($(this).parents('tr')).data();
            var categoryId = category._id;
            self.location.href = '/school/posts?category=' + categoryId;
        });


        function isEmpty(parameter) {
            return !parameter || parameter === '';
        }


    });
