'use strict';

requirejs(['jquery', 'restfulClient', 'leftMenu', 'headMenu', 'layerWrapper', 'datatables'],
    function ($, $http, leftMenu, headMenu, layer) {
        leftMenu.init();
        headMenu.init();
        var jqTable = $('#homework-list');
        var dataTable = jqTable.DataTable({
            'bAutoWidth': false,
            "bSort": false,
            'language': {
                'url': '/js/lib/plugins/dataTable/Chinese.lang'
            }
        });
        jqTable.on('click', '.delete', function () {
            var homeworkId = $(this).attr('id'),
                self = $(this);
            layer.confirm('注意，作业删除后将无法恢复',
                function () {
                    $http.del('/api/v1/homework/' + homeworkId, function () {
                        dataTable
                            .row(self.parents('tr'))
                            .remove()
                            .draw();
                    });
                });
        });
    });
