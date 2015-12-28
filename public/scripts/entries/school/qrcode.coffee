'use strict';

app = require '../../common/app'
QrCode = require '../../lib/qrcode'

$ ->
  app()
  qrcode = new QrCode(document.getElementById('qrcode'), {
    width: 300,
    height: 300
  })
  qrcode.makeCode $("#url").val()

