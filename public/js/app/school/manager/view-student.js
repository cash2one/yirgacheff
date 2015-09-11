'use strict';


requirejs(['jquery', 'leftMenu', 'headMenu', 'pagination', 'jqueryForm'],
    function ($, leftMenu, headMenu ,pagination) {

            leftMenu.init();
            headMenu.init();

            //初始化
            function initPaging(){
                $('#record-list').find('li').each(function(index){
                    if(index > 4)$(this).hide();
                });
            }
            initPaging();

            //分页
            var total = pagination.totalNum('record-list', 'records');
            if(total > 0){
                pagination.paginate('record-list', total, 5, 'pagination');
            }


    });