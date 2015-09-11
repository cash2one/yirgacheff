'use strict';

define(['jquery', 'qrcode'], function ($) {

    var makeCode = function (id, path) {
        var qrcode = new QRCode(document.getElementById(id), {
            width : 220,
            height : 220
        });
        if(path){
            qrcode.makeCode(path);
        }
    };
    return {
        makeCode: makeCode
    };
});