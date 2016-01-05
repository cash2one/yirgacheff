require '../lib/uploadifive'
require '../lib/uploadifive/uploadifive.css'
notify = require './notify'

VISIT_URL = "http://7rfll3.com1.z0.glb.clouddn.com/"
TOKEN_API = "/api/v1/qiniu/token"
UPLOAD_API = "http://upload.qiniu.com/"

modal = """
<div class="modal fade" id="_uploadFiveModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title" id="myModalLabel">文件上传</h4>
            </div>
            <div class="modal-body">
                <div class="alert-2 alert-warning-2">
                    <p>1.单张图片最大不要超过2M，不要发布涉嫌违法的图片。</p>
                    <p>2.在上传过程中，请不要刷新页面，以免导致上传图片失败。</p>
                    <p>3.如您对添加的图片不满意，可点击图片右侧的删除图标，将其从上传队列中删除。</p>
                </div>
                <div class="upload-area slimscroll" id="uploadifive-queue">

                </div>
            </div>
            <div class="modal-footer">
                <input type='file' id='_upload_file'>
                <button type="button" class="btn btn-default" id="_upload_save">确定</button>
            </div>
        </div>
    </div>
</div>
"""

#获取七牛上传key
token = null
$.ajax(
  url: TOKEN_API
  async: false
).then (res) -> token = res.token


#单个文件上传
singleUpload = (opts)->
  file = opts.file
  $file = if typeof file is 'object' then file else $('#' + file)
  done = opts.done
  uploadOpts =
    'uploadScript': UPLOAD_API
    'fileObjName': "file"
    'multi': false
    'buttonText': opts.buttonText || '上传'
    'removeCompleted': true
    'formData':
      'token': token

    'onUploadComplete': (file, data) ->
      ret = $.parseJSON(data)
      ret.path = VISIT_URL + ret.key
      ret.name = file.name
      done(ret)

  $file.uploadifive uploadOpts


#多文件同时上传
multiUpload = (opts)->
  $('body').append($(modal));
  $('.slimscroll').slimscroll(
    allowPageScroll: true
    height: 300
  )
  btn = opts.button
  done = opts.done
  $btn = if typeof btn is 'object' then btn else $('#' + btn)
  uploaded = []
  isComplete = false
  uploadOpts =
    'uploadScript': UPLOAD_API
    'fileObjName': "file"
    'multi': true
    'queueID': "uploadifive-queue"
    'buttonText': '上传'
    'formData':
      'token': token

    'onUploadComplete': (file, data) ->
      ret = $.parseJSON(data)
      ret.path = VISIT_URL + ret.key
      ret.name = file.name
      uploaded.push(ret)

    'onQueueComplete': () ->
      isComplete = true

    'onCancel': (file)->
      uploaded = (item for item in uploaded when item.name isnt file.name)

    'onUpload': ()->
      isComplete = false

  uploader = $("#_upload_file").uploadifive(uploadOpts)

  $("#_upload_save").click ()->
    if isComplete or uploaded.length is 0
      done(uploaded)
      $('#_uploadFiveModal').modal('hide')
      uploader.uploadifive("clearQueue") #清空上传队列
    else
      notify.warning "图片正在上传中..."

  $btn.click ()->
    uploaded = []
    isComplete = false
    uploader.uploadifive("clearQueue") #清空上传队列
    $('#_uploadFiveModal').modal()


module.exports = (opts = {})->
  multi = opts.multi || false
  if not multi
    singleUpload(opts)
  else
    multiUpload(opts)