'use strict';

require('../../common/formvalidator');
var app = require('../../common/app');
var notify = require('../../common/notify');

$(document).ready(function () {
    function makeRecord(data) {
        var timeStr = data.createdTime.substr(0, 10);
        var result = '<li>';
        result += '<div>'
            + '<div>' + timeStr.substr(0, 7) + '</div>'
            + '<div>' + timeStr.substr(8) + '</div></div>'
            + '<div>'
            + '<div>'
            + data.content
            + '</div> </div> '
            + '<div>'
            + '<div>记录人：' + GLOBAL.user.displayName + '</div></div>'
            + '</li>';
        return result;
    }

    $("#recordForm").validate(function ($form) {
        var url = '/api/v1/connections/students/' + $("#studentId").val();
        var data = $form.serializeObject();
        $.post(url, data).then(function (data) {
            var record = makeRecord(data);
            var $first = $('#record-list').find('tr:first-child');
            $(record).insertBefore($first);
            $form[0].reset();
            notify.success("添加成功");
        });
    });

});
