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
        "sDom": 'T<"clear">lfrtip',
        "oTableTools": {
            "aButtons":[
                {
                    "sExtends":"xls",
                    "sFileName": "报名名单.xls",
                    "sButtonText":"导出到Excel"
                }
            ],
            "sSwfPath": "//cdn.bootcss.com/datatables-tabletools/2.1.5/swf/copy_csv_xls_pdf.swf"
        },
        'language': {
            'url': '/js/lib/plugins/dataTable/Chinese.lang'
        }
    });

    //$("#exportExcel").click(function () {
    //    //window.open('/school/events/manage/' + eventId + '/enroll/excel', "_self");
    //    //$('#enrollTable').tableExport({type:'excel',escape:'false'});
    //});

});
