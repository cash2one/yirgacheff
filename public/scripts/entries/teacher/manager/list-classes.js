'use strict';
var app = require('../../../common/app');
var layer = require('../../../common/layerWrapper');
var $http = require('../../../common/restfulClient');
var _ = require('underscore');


$(document).ready(function () {
    var classTemplate = _.template($("#classTemplate").html());
    var classList = $('#classList');
    var $classForm = $('#class-form');

    function formValidator(data) {
        if (data.className === '') {
            return '班级名称不能为空';
        }
    }

    $http.get('/api/v1/classes/me', function (data) {
        if (!data || data.length === 0) {
            $('.class-empty-tips').show();
        } else {
            _.forEach(data, function (clazz) {
                classList.append(classTemplate({clazz: clazz}));
            });
        }
    });

    //添加班级
    $('#addClazz').bind('click', function () {
        $classForm[0].reset();
        layer.ajaxForm({
            title: '班级信息',
            container: 'class-dialog',
            form: $classForm,
            validator: formValidator,
            ajax: {
                url: '/api/v1/classes',
                type: 'POST',
                success: function (data, done) {
                    $('.class-empty-tips').hide();
                    classList.append(classTemplate({clazz: data}));
                    done();
                }
            }
        });
    });

    classList.on('click', '.delete-class', function () {
        var currentClass = $(this).closest('tr.classItem');
        layer.confirm('确定要删除班级?', function () {
            var url = '/api/v1/classes/' + currentClass.attr('id');
            $http.del(url, function () {
                currentClass.remove();
            });
        });
    });

});