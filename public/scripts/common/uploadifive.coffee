require '../lib/uploadifive'
require '../lib/uploadifive/uploadifive.css'
notify = require './notify'

VISIT_URL = "http://7rfll3.com1.z0.glb.clouddn.com/"
TOKEN_API = "/api/v1/qiniu/token"
UPLOAD_API = "http://upload.qiniu.com/"

modalTemplate = """
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
  fileType = opts.fileType or 'image/*' #默认上传图片
  uploadOpts =
    'uploadScript': UPLOAD_API
    'fileObjName': "file"
    'multi': false
    'buttonText': opts.buttonText || '上传'
    'removeCompleted': true
    'fileType': fileType
    'formData':
      'token': token

    'onUploadComplete': (file, data) ->
      ret = $.parseJSON(data)
      ret.path = VISIT_URL + ret.key
      ret.name = file.name
      done(ret)

  $file.uploadifive uploadOpts


#窗口上传,默认是多文件上传
modalUpload = (opts)->
  btn = opts.button
  $btn = if typeof btn is 'object' then btn else $('#' + btn)
  #单例模式,保证一个页面只存在一个模态窗口实例
  modal = UploadModal.getInstance()
  $btn.click ()->
    modal.initUploader(opts)
    modal.show()


#上传模态窗口类
class UploadModal
  constructor: ()->
    @version = 0
    @uploaded = []
    @isComplate = false
    @uploader = null
    $('body').append $(modalTemplate)
    $('.slimscroll').slimscroll
      allowPageScroll: true
      height: 300
    @done = ()->
    $("#_upload_save").click ()=>
      $("#uploadifive-queue").html ''
      if @uploaded.length is 0
        $('#_uploadFiveModal').modal('hide')
        console.warn "没有图片上传"
        return
      if @isComplete
        @done(@uploaded)
        $('#_uploadFiveModal').modal('hide')
      else
        notify.warning "图片正在上传中..."


  initUploader: (opts)->
    @uploaded = []
    @isComplate = false
    @done = opts.done
    multi = opts.multi ? true
    buttonText = opts.buttonText ? '上传'
    fileSizeLimit = opts.fileSizeLimit ? '5MB'
    fileType = opts.fileType ? 'image/*' #默认上传图片
    uploadOpts =
      'uploadScript': UPLOAD_API
      'fileObjName': "file"
      'multi': multi
      'queueID': "uploadifive-queue"
      'buttonText': buttonText
      'fileSizeLimit': fileSizeLimit
      'fileType': fileType
      'formData':
        'token': token
      onUploadComplete: (file, data) =>
        ret = $.parseJSON(data)
        ret.path = VISIT_URL + ret.key
        ret.name = file.name
        @uploaded.push(ret)
      onQueueComplete: () =>
        @isComplete = true

      onCancel: (file) =>
        @uploaded = (item for item in @uploaded when item.name isnt file.name)

      onUpload: () =>
        @isComplete = false

    @uploader = $("#_upload_file").uploadifive(uploadOpts)
    @uploader.uploadifive("clearQueue") #清空上传队列


  show: ()->
    $('#_uploadFiveModal').modal()


  @getInstance: ()->
    if @instance?
      return @instance
    @instance = new UploadModal()


module.exports = (opts = {})->
  window = opts.button || false
  if not window
    singleUpload(opts)
  else
    modalUpload(opts)