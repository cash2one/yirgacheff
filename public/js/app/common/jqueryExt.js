'use strict';

define(['jquery'], function ($) {
    $.fn.serializeObject = function () {
        var obj = {},
            a = this.serializeArray();
        $.each(a, function () {
            if (obj[this.name]) {
                if (!obj[this.name].push) {
                    obj[this.name] = [obj[this.name]];
                }
                obj[this.name].push(this.value || '');
            } else {
                obj[this.name] = this.value || '';
            }
        });
        return obj;
    };

    $.fn.renderForm = function (object) {
        function setProperty(self, outerKey, object) {
            for (var key in object) {
                if (object.hasOwnProperty(key)) {
                    var value = object[key];
                    var fk = outerKey ? outerKey + '.' + key : key;
                    if (typeof value !== 'object') {
                        var input = $(self).find('input[name="' + fk + '"],select[name="' + fk + '"],textarea[name="' + fk + '"]');
                        if (input.length > 0) {
                            input.val(value);
                        }
                    } else {
                        setProperty(self, fk, value);
                    }
                }
            }
        }

        setProperty($(this), null, object);
    };
});
