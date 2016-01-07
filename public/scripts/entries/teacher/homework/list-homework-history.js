'use strict';

require('datatables');
var app = require('../../../common/app');
$(document).ready(function () {
    $('#homework-list').dataTable({
        'bAutoWidth': true,
        "bSort": false,
        'language': {
            'url': '/js/lib/plugins/dataTable/Chinese.lang'
        }
    });
});
