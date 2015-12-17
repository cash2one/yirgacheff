/**
 * Created by Administrator on 15-5-25.
 */
requirejs.config({
    baseUrl: '/js',
    urlArgs: 'v=3',
    paths: {
        // lib
        'jquery': ['//cdn.staticfile.org/jquery/1.11.1/jquery.min', 'lib/jquery'],
        'underscore': ['//cdn.staticfile.org/underscore.js/1.7.0/underscore-min', 'lib/underscore-min'],
        'datatables': ['//cdn.staticfile.org/datatables/1.10.3/js/jquery.dataTables.min', 'lib/plugins/dataTable/jquery.dataTables.min'],
        'audiojs': ['//cdn.staticfile.org/audiojs/0.0.1/audio.min', 'lib/audio.min'],
        'highcharts': ['//cdn.staticfile.org/highcharts/4.0.4/highcharts', 'lib/highcharts'],
        'highcharts-theme': 'lib/highcharts-themes.min',
        'validator': 'lib/validator.min',
        'easyDropDown': 'lib/plugins/easy-dropdown/jquery.easydropdown.min',
        'jqueryRest': 'lib/plugins/jquery.rest.min',
        'layer': 'lib/plugins/layer/layer.min',
        'laypage': 'lib/plugins/layerpage/laypage.min',
        'jqueryForm': 'lib/plugins/jquery.form.min',
        'jqueryJson': 'lib/plugins/jquery.json.min',
        'lazyLoad': ['//cdn.jsdelivr.net/jquery.lazyload/1.9.3/jquery.lazyload.min', 'lib/plugins/jquery.lazyload'],
        'fullcalendar': ['//cdn.staticfile.org/fullcalendar/2.2.0/fullcalendar.min', 'lib/fullcalendar.min'],
        'fullcalendar-zh': 'lib/lang/zh-cn',
        'moment': 'lib/moment.min',
        'datepicker': 'lib/plugins/datepicker/jquery.datetimepicker',
        'jtip': ['//cdn.bootcss.com/qtip2/2.2.1/basic/jquery.qtip.min', 'lib/jquery.qtip.min'],
        'qrcode': 'lib/qrcode.min',
        'darktooltip': 'lib/jquery.darktooltip.min',
        'qiniu': 'lib/qiniu.min',
        'plupload': 'lib/plupload.full.min',
        'lightbox': 'lib/lightbox-2.6.min',
        'ueditor': 'lib/ueditor/ueditor.all.min',
        'ueditor-config': 'lib/ueditor/ueditor.config',
        'bootstrap': 'lib/bootstrap',

        // common modules
        'exerciseBuilder': 'app/common/exercise_builder',
        'exerciseReadOnlyBuilder': 'app/common/exerciseReadOnlyBuilder',
        'utils': 'app/common/function-utils',
        'pagination': 'app/common/pagination',
        'vdatePicker': 'app/common/date-picker',
        'layerWrapper': 'app/common/layerWrapper',
        'infoBox': 'app/common/info_box',
        'leftMenu': 'app/common/left_menu',
        'headMenu': 'app/common/head_menu',
        'jqueryExt': 'app/common/jqueryExt',
        'student_head_menu': 'app/common/student_head_menu',
        'qrcode_generator': 'app/common/qrcode_generator',
        'imageLibrary': 'app/common/imageLibrary',
        'richEditor': 'app/common/richEditor',
        'upload': 'app/common/upload',
        'restfulClient': 'app/common/restfulClient'
    },

    shim: {
        'ueditor': {
            deps: ['ueditor-config'],
            exports: 'UE'
        },
        'bootstrap': ['jquery'],
        'jqueryForm': ['jquery'],
        'jqueryJson': ['jquery'],
        'easyDropDown': ['jquery'],
        'underscore': ['jquery'],
        'datatables': ['jquery'],
        'fullcalendar': ['jquery', 'moment'],
        'fullcalendar-zh': ['fullcalendar'],
        'jqueryRest': ['jquery'],
        'layer': ['jquery'],
        'layerpage': ['jquery'],
        'audiojs': {
            deps: ['jquery'],
            exports: 'audiojs'
        },
        'qiniu': {
            deps: ['plupload'],
            exports: 'Qiniu'
        },
        'plupload': ['jquery'],
        'lazyLoad': ['jquery'],
        'highcharts': ['jquery'],
        'highcharts-theme': ['highcharts'],
        'validator': ['jquery'],
        'datepicker': ['jquery'],
        'lightbox': ['jquery'],
        'darktooltip': ['jquery']
    }
});
