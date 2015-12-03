/**
 * Created by Administrator on 15-5-25.
 */
requirejs.config({
    baseUrl: '/js',
    paths: {
        // lib
        'jquery': 'lib/jquery',
        'underscore': 'lib/underscore-min',
        'easyDropDown': 'lib/plugins/easy-dropdown/jquery.easydropdown.min',
        'jqueryRest': 'lib/plugins/jquery.rest.min',
        'layer': 'lib/plugins/layer/layer.min',
        'laypage': 'lib/plugins/layerpage/laypage.min',
        'datatables': 'lib/plugins/dataTable/jquery.dataTables.min',
        'audiojs': 'lib/audio.min',
        'highcharts': 'lib/highcharts',
        'highcharts-theme': 'lib/highcharts-themes.min',
        'validator': 'lib/validator.min',
        'lazyLoad': 'lib/plugins/jquery.lazyload',
        'jqueryForm': 'lib/plugins/jquery.form.min',
        'jqueryJson': 'lib/plugins/jquery.json.min',
        'fullcalendar': 'lib/fullcalendar.min',
        'fullcalendar-zh': 'lib/lang/zh-cn',
        'moment': 'lib/moment.min',
        'datepicker': 'lib/plugins/datepicker/jquery.datetimepicker',
        'jtip': 'lib/jquery.qtip.min',
        'qrcode': 'lib/qrcode.min',
        'darktooltip': 'lib/jquery.darktooltip.min',
        'qiniu': 'lib/qiniu.min',
        'plupload': 'lib/plupload.full.min',
        'lightbox': 'lib/lightbox-2.6.min',
        'ueditor': 'lib/ueditor/ueditor.all.min',
        'ueditor-config': 'lib/ueditor/ueditor.config',

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
        'jqueryForm': ['jquery'],
        'jqueryJson': ['jquery'],
        'easyDropDown': ['jquery'],
        'underscore': ['jquery'],
        'datatables': ['jquery'],
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
        'fullcalendar': ['jquery', 'moment'],
        'fullcalendar-zh': ['fullcalendar'],
        'lazyLoad': ['jquery'],
        'highcharts': ['jquery'],
        'highcharts-theme': ['highcharts'],
        'validator': ['jquery'],
        'datepicker': ['jquery'],
        'lightbox': ['jquery'],
        'darktooltip': ['jquery']
    }
});
