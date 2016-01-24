'use strict';

require('../../../common/formvalidator');
var app = require('../../../common/app');
var notify = require('../../../common/notify');


$(document).ready(function () {
    app();
    var rawTable = $('#teacher-list');
    var dataTable = rawTable.DataTable({
        'bAutoWidth': false,
        'bSort': false,
        'language': {
            'url': '/js/lib/plugins/dataTable/Chinese.lang'
        }
    });

    //转让班级
    rawTable.on('click', '.exchange', function () {
        var classId = $(this).parents("tr").attr("id");
        $("#exchangeModal").modal("show");
        $("#classId").val(classId);
    });


    $("#exchangeForm").validate(function ($form, data) {
        var url = '/api/v1/classes/changeOwner';
        $.ajax({
            url: url,
            method: "PUT",
            data: data
        }).then(function () {
            notify.success("转班成功")
        });
    });

});

