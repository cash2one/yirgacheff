'use strict';

requirejs(['jquery', 'leftMenu', 'headMenu', 'easyDropDown', 'datatables'],
    function ($, leftMenu, headMenu) {
            leftMenu.init();
            headMenu.init();
            $('#library-list').dataTable({
                'bAutoWidth': true,
                "bSort": false,
                'language': {
                    'url': '/js/lib/plugins/dataTable/Chinese.lang'
                }
            });

    });