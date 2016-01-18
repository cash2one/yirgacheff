/**
 * Created by Admin on 2016/1/18.
 */
'use strict';
var app = require('../../../common/app');
require('bootstrap-switch');
require('bootstrap-switch/dist/css/bootstrap3/bootstrap-switch.css');

$(document).ready(function () {
    app = app();

    $("[name='task']").bootstrapSwitch();

    $('input[name="task"]').on('switchChange.bootstrapSwitch', function(event, state) {
        if(state){
            $(".tips").fadeIn();
            $("#taskScore").fadeOut();
        }
        else{
            $(".tips").fadeOut();
            $("#taskScore").fadeIn();
        }
    });
});
