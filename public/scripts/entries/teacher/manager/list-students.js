'use strict';

require('datatables');
require('../../../common/formvalidator');
var app = require('../../../common/app');
var notify = require('../../../common/notify');
var layer = require('../../../common/layerWrapper');

$(document).ready(function () {
    app();
    var $studentForm = $('#studentForm');
    var $scoreForm = $("#scoreForm");
    var $joinClassForm = $("#joinClassForm");
    var jqTable = $('#students-list');
    var classEdit =$('#class-info');

    var dataTable = jqTable.DataTable({
        'bAutoWidth': false,
        'bSort': false,
        'language': {
            'url': '/js/lib/plugins/dataTable/Chinese.lang'
        },
        'order': [[1, "desc"]]
    });

    $("#add-student-btn").click(function () {
        $("#studentModal").modal("show");
        $studentForm[0].reset();
    });

    $studentForm.validate(function ($form) {
        var student = $form.serializeObject();
        var studentId = student._id;
        if (!studentId || studentId === "") {
            var classId = $('#class-list').val();
            $.post('/api/v1/classes/' + classId + '/students', student).then(function (student) {
                notify.success("添加学生成功");
                dataTable.row.add(student).draw();
                $("#studentModal").modal('hide');
                $studentForm[0].reset();
            });
            return;
        }
        $.ajax({
            url: '/api/v1/students/' + studentId,
            type: 'PUT',
            data: student
        }).then(function (student) {
            $("#studentModal").modal('hide');
            notify.success("修改学生信息成功");
            dataTable.row("#" + studentId).data(student).draw();
            $studentForm[0].reset();
        });

    });

    //转让班级
    classEdit.on('click', '.exchange-class', function () {
        var currentClass = $(this).closest('tr.classItem'),
            className = currentClass.attr('data-name'),
            url = '/api/v1/classes/' + currentClass.attr('id') + '/changeOwner';

        layer.ajaxForm({
            title: className,
            container: 'exchange-class',
            form: 'exchange-form',
            validator: function (data) {
                if (data.username === '') {
                    return '输入老师工号';
                }
                if (data.username === GLOBAL.user.username) {
                    return '不能转让给自己';
                }
            },
            ajax: {
                url: url,
                type: 'PUT',
                success: function (data, done) {
                    self.location = '';
                    done();
                }
            }
        });
    });

    // 修改学生
    jqTable.on('click', '.edit', function () {
        $studentForm.renderForm(dataTable.row($(this).parents('tr')).data());
        $("#studentModal").modal('show');
    });

    // 修改学生积分
    $('.batch-select').on('click', '.score-edit', function () {
        $("#scoreModal").modal('show');
        $scoreForm[0].reset(0);
        var student = $(this).parents('tr').attr("id");
        $scoreForm.find("[name='studentId']").val(student);
    });

    $scoreForm.validate(function ($form,data) {
        var studentId = data.studentId;
        $.ajax({
            url: '/api/v1/students/' + studentId + '/score',
            type: 'PUT',
            data: data
        }).then(function (res) {
            $("#scoreModal").modal("hide");
            var row = dataTable.row("#" + studentId);
            var student = row.data();
            student.score = res.score;
            row.data(student).draw();
            notify.success("积分修改成功");
        });
    });

    //删除学生
    //jqTable.on('click', '.delete', function () {
    //    var self = $(this);
    //    $(this).popConfirm();
    //    var student = dataTable.row($(this).parents('tr')).data();
    //    var currentClass = $classList.val();
    //    layer.confirm('您确定要删除当前学生?', function () {
    //        var url = '/api/v1/classes/' + currentClass + '/students/' + student._id;
    //        $http.del(url, function () {
    //            dataTable
    //                .row(self.parents('tr'))
    //                .remove()
    //                .draw();
    //            notify.success('删除学生成功');
    //        });
    //    });
    //});

    $joinClassForm.validate(function ($form,data) {
        var classId = $('#class-list').val();
        $.ajax({
            url: '/api/v1/classes/' + classId + '/students',
            data: data,
            type: 'PUT'
        }).then(function (student) {
            notify.success("添加学生成功");
            dataTable.row.add(student).draw();
            $("#joinClassModal").modal("hide");
        });
    });

    $('#download-btn').click(function () {
        var url = '/api/v1/classes/' + $('#class-list').val() + '/students/qrcode';
        window.open(url);
    });

    //全选
    $('#SelectAll').click(function () {
        var allChecked = $(this).is(':checked');
        $("td input[type='checkbox']").prop("checked", allChecked);
    });

});
