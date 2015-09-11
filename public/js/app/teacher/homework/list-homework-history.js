'use strict';

requirejs(['jquery', 'leftMenu', 'headMenu', 'datatables'],
    function ($, leftMenu, headMenu) {
            leftMenu.init();
            headMenu.init();
            $('#homework-list').dataTable({
                'bAutoWidth': true,
                "bSort": false,
                'language': {
                    'url': '/js/lib/plugins/dataTable/Chinese.lang'
                }
            });
    });