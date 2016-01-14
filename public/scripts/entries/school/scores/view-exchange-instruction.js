'use strict';
var app = require('../../../common/app');
var notify = require('../../../common/notify');

$(document).ready(function () {
    app();
    var $textArea = $('#rules-explanation');
    $('#mod-instruction-btn').click(function () {
        $textArea.removeAttr("readonly");
        $textArea.focus();
        $('#explanation-save').show();
    });


    $('#explanation-save').click(function () {
        var instruction = $('#rules-explanation').val();
        if (!instruction || instruction === '') {
            notify.warning('说明不能为空');
        }
        $.post('/api/v1/scores/scoreExchangeInstructions', {content: instruction}).then(function () {
            notify.success('保存成功');
            $('#explanation-save').hide();
            $('#rules-explanation').attr('readonly', 'readonly');
        });
    });
});

