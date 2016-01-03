'use strict';
var app = require('../../../common/app');
var notify = require('../../../common/notify');

$(document).ready(function () {
    app();

    $('#mod-instruction-btn').click(function () {
        $('#rules-explanation').removeAttr("readonly");
        $('#explanation-save').show();
    });


    $('#explanation-save').click(function () {
        var instruction = $('#rules-explanation').val();
        if (!instruction || instruction === '') {
            layer.msg('说明不能为空');
        }
        $http.post('/api/v1/scores/scoreExchangeInstructions', {
            content: instruction
        }, function (data) {
            layer.msg('保存成功');
            $('#explanation-save').hide();
            $('#rules-explanation').attr('readonly', 'readonly');
        });
    });
});

