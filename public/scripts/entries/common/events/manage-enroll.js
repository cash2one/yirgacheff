/**
 * Created by Admin on 2016/1/11.
 */

var app = require('../../../common/app');
$(document).ready(function () {
    var eventId = $("#eventId").val();
    app();
    $('#enrollTable').DataTable({
        'bAutoWidth': true,
        'bSort': false,
        'language': {
            'url': '/js/lib/plugins/dataTable/Chinese.lang'
        }
    });

    $("#exportExcel").click(function () {
        window.open('/school/events/manage/' + eventId + '/enroll/excel', "_self");
    });

});
