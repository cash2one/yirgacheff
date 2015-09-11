'use strict';


requirejs(['jquery', 'restfulClient', 'leftMenu', 'headMenu', 'validator', 'layerWrapper', 'easyDropDown'],
    function ($, $http, leftMenu, headMenu, validator, layer) {

        leftMenu.init();
        headMenu.init();

        $('.update-btn').click(function () {
            var parent = $(this).closest('span');
            parent.find('input[name="value"]').removeAttr("readonly").focus();
            parent.find('.save-btn').show();
            $(this).hide();
        });

        $('.save-btn').click(function () {
            var parent = $(this).closest('span'),
                value = parent.find('input[name="value"]').val(),
                key = parent.find('input[name="key"]').val(),
                self = $(this),
                url = '/api/v1/scores/rules';
            if (!validator.isInt(value) || value < 0 || value > 9999) {
                layer.msg('积分必须为0-9999的数字');
                return;
            }
            $http.put(url, {
                value: value,
                key: key
            }, function () {
                self.hide();
                parent.find('input[name="value"]').attr('readonly', 'readonly');
                parent.find('.update-btn').show();
            });
        });
    });
