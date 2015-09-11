'use strict';

requirejs(['jquery', 'restfulClient', 'leftMenu', 'headMenu', 'layerWrapper', 'underscore', 'jqueryExt'],
    function ($, $http, leftMenu, headMenu, layer, _) {
        leftMenu.init();
        headMenu.init();
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

        //修改班级
        classList.on('click', '.modify-class', function () {
            var currentClass = $(this).closest('div.classItem');
            var className = currentClass.attr('data-name');
            var classId = currentClass.attr('id');
            $classForm.find('input[name="className"]').val(className);
            layer.ajaxForm({
                container: 'class-dialog',
                form: $classForm,
                validator: formValidator,
                ajax: {
                    url: '/api/v1/classes/' + classId,
                    type: 'PUT',
                    success: function (data, done) {
                        currentClass.find('.className').text(data.className);
                        currentClass.attr('data-name', data.className);
                        done();
                    }
                }
            });
        });

        //转让班级
        classList.on('click', '.exchange-class', function () {
            var currentClass = $(this).closest('div.classItem'),
                className = currentClass.attr('data-name'),
                url = '/api/v1/classes/' + currentClass.attr('id') + '/changeOwner';
            $('#exchange-class').find('.jqititle').text(className);
            layer.ajaxForm({
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

        classList.on('click', '.delete-class', function () {
            var currentClass = $(this).closest('div.classItem');
            layer.confirm('确定要删除班级?', function () {
                var url = '/api/v1/classes/' + currentClass.attr('id');
                $http.del(url, function () {
                    currentClass.remove();
                });
            });
        });
    });
