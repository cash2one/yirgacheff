'use strict';


requirejs(['jquery', 'restfulClient', 'leftMenu', 'headMenu', 'layerWrapper', 'easyDropDown', 'datatables'],
    function ($, $http, leftMenu, headMenu, layer) {
        leftMenu.init();
        headMenu.init();
        var jqTable = $('#library-list');
        var dataTable = jqTable.DataTable({
            'bAutoWidth': true,
            'bSort': false,
            'language': {
                'url': '/js/lib/plugins/dataTable/Chinese.lang'
            }
        });

        jqTable.on('click', '.delete-btn', function () {
            var self = $(this),
                quizId = self.attr('id');
            layer.confirm('确定要删除该套题?', function () {
                var url = '/api/v1/quizzes/' + quizId;
                $http.del(url, function () {
                    dataTable
                        .row(self.parents('tr'))
                        .remove()
                        .draw();
                    layer.msg('删除套题成功');
                });
            });
        });
    });
