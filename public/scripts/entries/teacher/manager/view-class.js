'use strict';


require('datatables');
require('../../../common/formvalidator');
var app = require('../../../common/app');

$(document).ready(function () {
    app = app();
    var $changeClassForm = $('#exchangeForm');
    var $clazzMenu = $("#clazzMenu");
    var $studentForm = $('#studentForm');
    var $modifyStudentForm = $("#modifyStudentForm");
    var $scoreForm = $("#scoreForm");
    var $classForm = $("#classForm");
    var $classModal = $("#classModal");
    var $scoreModal = $("#scoreModal");
    var $joinClassForm = $("#joinClassForm");
    var jqTable = $('#students-list');
    var classId = $("#classId").val();
    var dataTable = jqTable.DataTable({
        'bAutoWidth': false,
        'bSort': false,
        'language': {
            'url': '/js/lib/plugins/dataTable/Chinese.lang'
        },
        'ajax': {
            url: '/api/v1/classes/' + classId + '/students',
            dataSrc: ''
        },
        rowId: '_id',
        'columns': [
            {
                'data': null,
                'defaultContent': '<div class="checkbox c-checkbox"><label><input type="checkbox"><span class="fa fa-check"></span></label></div>'
            },
            {'data': 'displayName'},
            {'data': 'username'},
            {'data': 'password'},
            {'data': 'gender'},
            {'data': 'score'},
            {
                'data': null,
                'defaultContent': '<a href="javascript:void(0)" class="m-r-xs f-info view" title="查看"><i class="icon icon-xiangqing"></i></a>' +
                '<a href="javascript:void(0)" class="f-info edit m-r-xs" title="修改"><i class="icon icon-xiugai"></i></a>' +
                '<a href="javascript:void(0)" class="f-pink delete m-r-xs" title="删除"><i class="icon icon-shanchu"></i></a>'

            }],
        'order': [[1, "desc"]]
    });

    //转让班级
    $clazzMenu.on('click', '.changeClass', function () {
        $changeClassForm.parents('.modal').modal('show');
        $("#classId").val()
    });


    $("#editClass").click(function () {
        var className = $("#className").html().trim();
        var courseTime = $("#courseTime").html().trim();
        $classForm.renderForm({className: className, courseTime: courseTime});
        $classModal.modal("show");
    });

    $classForm.validate(function ($form, data) {
        var classId = $("#classId").val();
        var url = '/api/v1/classes/' + classId;
        $.ajax({
            url: url,
            method: 'PUT',
            data: data
        }).then(function () {
            $("#className").html(data.className);
            $("#courseTime").html(data.courseTime);
            $classModal.modal('hide');
        });
    });


    $changeClassForm.validate(function ($form, data) {
        var url = '/api/v1/classes/changeOwner';
        $.ajax({
            url: url,
            method: "PUT",
            data: data
        }).then(function () {
            self.location.href = "/teacher/classes";
        });
    });

    //删除班级
    $clazzMenu.on('click', '.deleteClass', function () {
        var deleteClassId = $("#classId").val();
        if (confirm("您确定要删除这个班？")) {
            $.ajax({
                url: '/api/v1/classes/' + deleteClassId,
                method: 'DELETE'
            }).then(function () {
                self.location.href = "/teacher/classes";
            });
        }
    });

    $("#add-student-btn").click(function () {
        $("#studentModal").modal("show");
        $studentForm[0].reset();
        $joinClassForm[0].reset();
    });

    $studentForm.validate(function ($form, student) {
        $.post('/api/v1/classes/' + classId + '/students', student)
            .then(function (student) {
                app.notify.success("添加学生成功");
                dataTable.row.add(student).draw();
                $("#studentModal").modal('hide');
                $studentForm[0].reset();
            });
    });


    // 修改学生
    jqTable.on('click', '.edit', function () {
        var student = dataTable.row($(this).parents('tr')).data();
        $modifyStudentForm.renderForm(student);
        $("#modifyStudentModal").modal('show');
    });

    jqTable.on('click', '.view', function () {
        var studentId = $(this).parents('tr').attr('id');
        self.location.href = "/teacher/students/" + studentId;
    });

    $modifyStudentForm.validate(function ($form, student) {
        var studentId = student._id;
        $.ajax({
            url: '/api/v1/students/' + studentId,
            type: 'PUT',
            data: student
        }).then(function (student) {
            $("#modifyStudentModal").modal('hide');
            app.notify.success("修改学生信息成功");
            dataTable.row("#" + studentId).data(student).draw();
            $form[0].reset();
        });
    });


    $("#batchScore").click(function () {
        var selected = getSelectedStudents();
        if (selected.length === 0) {
            return app.notify.warning("至少选中一个学生");
        }
        $scoreModal.modal("show");
    });

    $("#batchDelete").click(function () {
        var selected = getSelectedStudents();
        if (selected.length === 0) {
            return app.notify.warning("至少选中一个学生");
        }
        if (confirm("确定要删除这批学生?")) {
            $.ajax({
                url: '/api/v1/classes/' + classId + '/students',
                method: 'DELETE',
                data: {students: selected}
            }).then(function () {
                for (var i = 0; i < selected.length; i++) {
                    dataTable.row("#" + selected[i]).remove().draw();
                }
                app.notify.success('删除学生成功');
            });
        }
    });

    //积分操作
    $scoreForm.validate(function ($form, data) {
        data.students = getSelectedStudents();
        $.ajax({
            url: '/api/v1/students/score',
            type: 'PUT',
            data: data
        }).then(function () {
            self.location.href = '';
        });
    });

    //删除学生
    jqTable.on('click', '.delete', function () {
        var studentId = $(this).parents('tr').attr("id");
        if (confirm("确定要删除学生?")) {
            var url = '/api/v1/classes/' + $("#classId").val() + '/students/' + studentId;
            $.ajax({
                url: url,
                method: 'DELETE'
            }).then(function () {
                app.notify.success('删除学生成功');
                dataTable.row('#' + studentId).remove().draw();
            });
        }
    });

    //按学号添加学生
    $joinClassForm.validate(function ($form, data) {
        $.ajax({
            url: '/api/v1/classes/' + classId + '/students',
            data: data,
            type: 'PUT'
        }).then(function (student) {
            app.notify.success("添加学生成功");
            dataTable.row.add(student).draw();
            $("#studentModal").modal("hide");
        });
    });

    $('#download-btn').click(function () {
        var url = '/api/v1/classes/' + classId + '/students/doc';
        window.open(url);
    });

    //全选
    $('#SelectAll').click(function () {
        var allChecked = $(this).is(':checked');
        $("td input[type='checkbox']").prop("checked", allChecked);
    });

    function getSelectedStudents() {
        var selected = [];
        $("td input[type='checkbox']").each(function () {
            if ($(this).prop("checked")) {
                selected.push($(this).closest("tr").attr("id"));
            }
        });
        return selected;
    }

});
