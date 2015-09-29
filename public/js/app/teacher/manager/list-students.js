'use strict';

requirejs(['jquery', 'restfulClient', 'datatables', 'leftMenu', 'headMenu', 'validator', 'layerWrapper', 'easyDropDown', 'jqueryExt'],
    function ($, $http, datatables, leftMenu, headMenu, validator, layer) {
        leftMenu.init();
        headMenu.init();
        var $studentForm = $('#student-form');
        var jqTable = $('#students-list');
        var $classList = $('#class-list');

        var validateClass = function () {
            if (!$classList.val()) {
                layer.confirm('没有班级，去添加新班级', function () {
                    self.location = '/teacher/classes';
                });
                return false;
            }
            return true;
        };

        if (!validateClass()) {
            return;
        }

        var dataTable = jqTable.DataTable({
            'bAutoWidth': false,
            'bSort': false,
            'language': {
                'url': '/js/lib/plugins/dataTable/Chinese.lang'
            },
            'ajax': {
                dataSrc: ''
            },
            'order': [[1, "desc"]],
            'columns': [
                {'data': 'displayName'},
                {'data': 'username'},
                {'data': 'password'},
                {'data': 'gender'},
                {'data': 'score'},
                {
                    'data': null,
                    'defaultContent': '<a class="btn-small a-btn-blue edit" >修改</a>&nbsp;&nbsp;'
                    + '<a class="btn-small a-btn-blue score-edit" >积分</a>&nbsp;&nbsp;' +
                    '<a class="btn-small a-btn-red delete">删除</a>'
                }
            ]
        });
        $classList.change(function () {
            if ($(this).val() === "") {
                return;
            }
            var url = '/api/v1/classes/' + $(this).val() + '/students';
            dataTable.ajax.url(url).load();
        });
        //$classList.trigger('change');
        (function () {
            var selectClass = $classList.val();
            if (!selectClass || selectClass === '') {
                layer.msg('请先添加班级');
                return;
            }
            var url = '/api/v1/classes/' + selectClass + '/students';
            dataTable.ajax.url(url);
        })();

        function formValidator(student) {

            if (student.displayName.trim() === '') {
                return '姓名不能为空！';
            }
            if (student.displayName.trim().length > 5) {
                return '姓名不能超过 5 个字符';
            }
            if (student.password && student.password.trim().length > 8) {
                return '密码不能超过 8 个字符';
            }
            if (student.phone.trim() === '') {
                return '电话不能为空！';
            }
            if (!validator.isMobilePhone(student.phone, 'zh-CN')) {
                return '电话号码无效，请重新输入！';
            }
            if (student.schoolName && student.schoolName.trim().length > 50) {
                return '学校名称不能超过 50 个字符';
            }
            if (student.grade && student.grade.trim().length > 10) {
                return '年级名称不能超过 10 个字符';
            }


        }

        //添加学生
        $('#add-student-btn').bind('click', function () {
            var classId = $('#class-list').val();
            if (!classId || classId === "") {
                return layer.msg("请先创建班级");
            }
            $studentForm[0].reset();
            var randomPassword = new Date().getTime().toString(16).substr(4);
            $('#password').val(randomPassword);
            layer.ajaxForm({
                title: '添加学生',
                container: 'student-dialog',
                form: $studentForm,
                validator: formValidator,
                ajax: {
                    url: '/api/v1/classes/' + classId + '/students',
                    type: 'POST',
                    success: function (data, done) {
                        dataTable.row.add(data).draw();
                        done();
                    }
                }
            });
        });

        // 修改学生
        jqTable.on('click', '.edit', function () {
            var student = dataTable.row($(this).parents('tr')).data();
            var self = $(this);
            $studentForm.renderForm(student);
            layer.ajaxForm({
                title: '修改学生',
                container: 'student-dialog',
                form: $studentForm,
                validator: formValidator,
                ajax: {
                    url: '/api/v1/students/' + student._id,
                    type: 'PUT',
                    success: function (data, done) {
                        dataTable
                            .row(self.parents('tr'))
                            .data(data)
                            .draw();
                        done();
                    }
                }
            });
        });

        // 修改学生积分
        jqTable.on('click', '.score-edit', function () {
            var student = dataTable.row($(this).parents('tr')).data();
            var isNumber = new RegExp('^\s*[1-9]+[0-9]*\s*$');
            var self = $(this);
            layer.ajaxForm({
                title: '积分修改',
                container: 'score-dialog',
                form: 'score-form',
                validator: function (data) {
                    if (!isNumber.test(data.value) && parseInt(data.value) > 999999) {
                        return '请输入大于0-999999的数字';
                    }
                },
                ajax: {
                    url: '/api/v1/students/' + student._id + '/score',
                    type: 'PUT',
                    success: function (data, done) {
                        student.score = data.score;
                        dataTable
                            .row(self.parents('tr'))
                            .data(student)
                            .draw();
                        done();
                    }
                }
            });
        });

        //删除学生
        jqTable.on('click', '.delete', function () {
            var self = $(this);
            var student = dataTable.row($(this).parents('tr')).data();
            var currentClass = $classList.val();
            layer.confirm('您确定要删除当前学生?', function () {
                var url = '/api/v1/classes/' + currentClass + '/students/' + student._id;
                $http.del(url, function () {
                    dataTable
                        .row(self.parents('tr'))
                        .remove()
                        .draw();
                    layer.msg('删除学生成功');
                });
            });
        });


        //从学号添加
        $('#add-username-btn').click(function () {
            var classId = $('#class-list').val();
            if (!classId || classId === "") {
                return layer.msg("请先创建班级");
            }
            layer.ajaxForm({
                title: '添加学生',
                container: 'joinclass-dialog',
                form: 'username-form',
                validator: function (data) {
                    if (data.username === '') {
                        return '学号不能为空';
                    }
                },
                ajax: {
                    url: '/api/v1/classes/' + $classList.val() + '/students',
                    type: 'PUT',
                    success: function (data, done) {
                        dataTable.row.add(data).draw();
                        done();
                    }
                }
            });
        });

        $('#download-btn').click(function () {
            var classId = $('#class-list').val();
            if (!classId || classId === "") {
                return layer.msg("请先创建班级");
            }
            var url = '/api/v1/classes/' + classId + '/students/qrcode';
            window.open(url);
        });

    });
