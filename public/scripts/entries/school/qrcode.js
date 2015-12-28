'use strict';
requirejs(['jquery', 'leftMenu', 'headMenu', 'qrcode'],
    function ($, leftMenu, headMenu) {
        leftMenu.init();
        headMenu.init();

        var qrcode = new QRCode(document.getElementById('qrcode'), {
            width : 300,
            height : 300
        });
        var url = $('#url').val();
        qrcode.makeCode(url);
    });
