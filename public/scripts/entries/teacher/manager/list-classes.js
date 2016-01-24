'use strict';
var _ = require ('underscore');
require('../../../common/formvalidator');
var app = require('../../../common/app');

$(document).ready(function () {
    app = app();
    var classTemplate = _.template($("#classTemplate").html());
    var classList = $('#classList');
    var $classForm = $('#classForm');
    var $classModal = $("#classModal");

    $.get('/api/v1/classes/me').then(function (data) {
        if (!data || data.length === 0) {
            $('.class-empty-tips').show();
        } else {
            _.forEach(data, function (clazz) {
                classList.append(classTemplate({clazz: clazz}));
            });
        }
    });

    $("#addClazz").click(function () {
        $classForm[0].reset();
        $classModal.modal("show");
    });

    $classForm.validate(function ($form, data) {
        $.post('/api/v1/classes', data).then(function (clazz) {
            app.notify.success("添加班级成功");
            classList.append(classTemplate({clazz: clazz}))
            $classModal.modal("hide");
        });
    });
});