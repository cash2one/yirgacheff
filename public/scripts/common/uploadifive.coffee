require '../lib/uploadifive'
require '../lib/uploadifive/uploadifive.css'

visitUrl = "http://7rfll3.com1.z0.glb.clouddn.com/"
token = null
$.ajax({
  url: '/api/v1/qiniu/token',
  async: false
}).then (tk) -> token = tk

module.exports = (opts = {})->
  file = opts.file
  done = opts.done
  preview = opts.preview
  style = opts.style
  buttonText = opts.buttonText || '上传'
  multi = opts.multi || false
  if not file?
    throw 'file is empty'
  if not done? or typeof done is not 'function'
    throw 'done function is empty'

  $file = if typeof file is 'object' then file else $('#' + file)
  uploadOptions =
    'uploadScript': 'http://upload.qiniu.com/'
    'buttonText': buttonText
    'fileObjName': 'file'
    'multi': multi
    'formData':
      'token': token
    'onUploadComplete': (file, data)->
      ret = $.parseJSON(data)
      ret.path = visitUrl + ret.key
      if preview?
        preview = if typeof preview is 'object' then preview else $('#' + preview)
        path = if style? then ret.path + '!' + style else ret.path
        preview.attr 'src', path
      done(ret)

  $file.uploadifive(uploadOptions)