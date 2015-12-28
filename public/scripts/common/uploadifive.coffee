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
                <div class="alert alert-warning">
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
).then (tk) -> token = tk


#单个文件上传
singleUpload = (opts)->
  opts =
    file: opts.file
    multi: false
    done: opts.done
  bindUpload opts

#多文件同时上传
multiUpload = (opts)->
  $('body').append($(modal));
  $('.slimscroll').slimscroll({
    allowPageScroll: true
  })
  btn = opts.button
  done = opts.done
  $btn = if typeof btn is 'object' then btn else $('#' + btn)
  uploaded = []
  uploader = $("#_upload_file")
  isComplete = false
  opts =
    file: uploader
    multi: true
    queueID: "uploadifive-queue"
    done: (uploads, queue)->
      uploaded = queue
      isComplete = true

  $("#_upload_save").click ()->
    if isComplete or uploaded.length is 0
      done(uploaded)
      $('#_uploadFiveModal').modal('hide')
      uploader.uploadifive("clearQueue") #先清空上传队列
    else
      notify.warning "图片正在上传中..."

  bindUpload opts
  $btn.click ()->
    isComplete = false
    uploader.uploadifive("clearQueue") #先清空上传队列
    $('#_uploadFiveModal').modal()

#绑定uploadifive
bindUpload = (opts = {})->
  queue = []
  file = opts.file
  done = opts.done
  buttonText = opts.buttonText || "上传"
  multi = opts.multi || false
  queueID = opts.queueID
  if typeof file isnt 'object'
    file = $("#" + file)

  uploadOptions =
    'uploadScript': UPLOAD_API
    'buttonText': buttonText
    'fileObjName': "file"
    'multi': multi
    'queueID': queueID || null
    'formData':
      'token': token
    'onUploadComplete': (file, data) ->
      ret = $.parseJSON(data)
      ret.path = VISIT_URL + ret.key
      if(multi)
        queue.push(ret)
      else
        done ret

    'onQueueComplete': (uploads) ->
      if multi
        done(uploads, queue)

  file.uploadifive(uploadOptions)


module.exports = (opts = {})->
  multi = opts.multi || false
  if not multi
    singleUpload(opts)
  else
    multiUpload(opts)