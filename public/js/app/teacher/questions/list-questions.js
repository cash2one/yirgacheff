'use strict';

requirejs(['jquery', 'leftMenu', 'headMenu','layer','easyDropDown', 'datatables'],
    function ($, leftMenu, headMenu,layer) {
        leftMenu.init();
        headMenu.init();
        $('#library-list').dataTable({
            'bAutoWidth': true,
            "bSort": false,
            'language': {
                'url': '/js/lib/plugins/dataTable/Chinese.lang'
            }
        });
        $('.quest-opts-area').find('.item').each(function () {
            $(this).bind('click', function () {
                var selected = $(this).hasClass('selected');
                if (!selected) {
                    $(this).addClass('selected').siblings().removeClass('selected');
                }

            });
        });


    });

