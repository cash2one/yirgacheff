/**
 * Created by Admin on 2016/1/9.
 */
'use strict';

require('../../../common/formvalidator');
var app = require('../../../common/app');
var notify = require('../../../common/notify');
var upload = require('../../../common/uploadifive');
var richEditor = require('../../../common/richEditor');
var weixinEditor = require('../../../common/weixinEditor');

$(document).ready(function () {
    app();

    //���༭����Ⱦ
    var editor = richEditor.render('content');
    //��ʼ��΢�ű༭��
    weixinEditor({editor: editor});

    //�����ϴ�
    upload({
        file: 'imageUpload',
        done: function (file) {
            $('#indexImage').attr('src', file.path);
            $('#coverImage').val(file.key);
        }
    });

    //��Ӹ�����Ϣ
    $(".enroll-field-btn").click(function() {
        var label = $(this).text().trim();
        var field = "<div class='form-group enroll-field'><label class='control-label col-xs-2'>" + label + "��</label> <div class='col-xs-10'><input class='form-control' type='text' name='infoCollect' value='" + label + "' placeholder='���������" + label + "' readonly><i class='delete fa fa-times f-gray f-s-16 pull-right m-t-n-lg m-r-xs'></i></div></div>";
        $('.enroll-extras').append(field);
    });
    //����Զ���
    $(".enroll-field-custom").click(function() {
        var info = $(this).text().trim();
        var field = "<div class='form-group enroll-field'>\n   " +
            "<label class='control-label col-xs-2'>" + info + "��</label>" +
            "<div class='col-xs-10'>" +
            "<input class='form-control' name='infoCollect' type='text' placeholder='���������" + info + "��Ϣ" + "'>" +
            "<i class='delete fa fa-times f-gray f-s-16 pull-right m-t-n-lg m-r-xs'></i> " +
            "</div>\n</div>";
        $('.enroll-extras').append(field);
    });
    $(".enroll-extras").on('click',".delete", function() {
        $(this).closest(".enroll-field").remove();
    });

});