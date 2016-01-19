'use strict';

app = require '../../common/app'
upload = require '../../common/uploadifive'

$ ->
  app = app()
  upload
    button: 'uploadQrcode',
    multi: false,
    done: (res)->
      file = res[0]
      $('#privateQrcode').attr("src", file.path)
      $("#downloadQrcode").attr('href', file.path)
      $("#downloadQrcode").show()
      $.ajax({
        url: '/api/v1/qrcode',
        method: 'PUT',
        data:
          qrcode: file.key
      }).then ()->
        app.notify.success "二维码上传成功"









