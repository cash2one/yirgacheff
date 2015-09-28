'use strict';
requirejs(['jquery', 'restfulClient', 'leftMenu', 'headMenu', 'validator', 'layerWrapper', 'datatables', 'jqueryExt'],
    function ($, $http, leftMenu, headMenu, validator, layer) {
        leftMenu.init();
        headMenu.init();
        var $table = $('#teacher-list');
        var $teacherForm = $('#teacher_form');
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
            'order': [[1, "desc"]],
            'columns': [
                {'data': 'displayName'},
                {'data': 'username'},
                {'data': 'password'},
                {'data': 'contact'},
                {'data': 'department'},
                {
                    'data': null,
                    'defaultContent': '<a class="w-btn-light w-btn-opt edit" >修改</a>&nbsp;&nbsp;' +
                    '<a class="w-btn w-btn-iron-red w-btn-opt delete">禁用</a>&nbsp;&nbsp;'
                }
            ]
        });

        function isEmpty(parameter) {
            return !parameter || parameter === '';
        }

        function formValidator(data) {
            data = data || {};
            if (isEmpty(data.displayName)) {
                return '姓名不能为空';
            }
            if (data.displayName.trim().length > 5) {
                return '姓名不能超过 5 个字符';
            }
            if (isEmpty(data.password) || !validator.isLength(data.password, 6, 20)) {
                return '请输入密码(6 - 20位 )'
            }
            if (isEmpty(data.contact) || !validator.isMobilePhone(data.contact, 'zh-CN')) {
                return '请输入正确格式的手机号码';
            }
            if (isEmpty(data.department)) {
                return '请输入部门';
            }
            if (data.department.trim().length > 10) {
                return '姓名不能超过 10 个字符';
            }
            return true;
        }

        //添加老师
        $('#add-teacher-btn').on('click', function () {
            $("#teacher_form")[0].reset();
            var randomPassword = new Date().getTime().toString(16).substr(4);
            $('#password').val(randomPassword);
            layer.ajaxForm({
                title:'新建教师',
                container: 'add-teacher-dialog',
                form: $teacherForm,
                validator: formValidator,
                ajax: {
                    url: '/api/v1/teachers',
                    type: 'POST',
                    success: function (data, done) {
                        dataTable.row.add(data).draw();
                        done();
                    }
                }
            });
        });


        $table.on('click', '.delete', function () {
            var teacher = dataTable.row($(this).parents('tr')).data();
            var self = $(this);
            layer.confirm('确定要禁用教师 ' + teacher.displayName + ' ?', function () {
                var url = '/api/v1/teachers/' + teacher._id;
                $http.del(url, function () {
                    dataTable
                        .row(self.parents('tr'))
                        .remove()
                        .draw();
                });
            });
        });

        $table.on('click', '.edit', function () {
            var teacher = dataTable.row($(this).parents('tr')).data();
            var self = $(this);
            $("#teacher_form").renderForm(teacher);
            layer.ajaxForm({
                title:'信息修改',
                container: 'add-teacher-dialog',
                form: $teacherForm,
                validator: formValidator,
                ajax: {
                    url: '/api/v1/teachers/' + teacher._id,
                    type: 'PUT',
                    success: function (data, done) {
                        console.log(dataTable
                            .row(self.parents('tr'))
                            .data());
                        console.log(data);
                        dataTable
                            .row(self.parents('tr'))
                            .data(data)
                            .draw();
                        done();
                    }
                }
            });
        });


    });
