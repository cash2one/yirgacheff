require '../../common/formvalidator'
app = require '../../common/app'
upload = require '../../common/uploadifive'
notify = require '../../common/notify'

$ ->
  app()
  upload({
    file: 'imageUpload',
    buttonText:'更换头像',
    done: (file)->
      url = "/api/v1/schools/#{GLOBAL.user._id.toString()}?me=true"
      data = avatar: file.key
      $.ajax({
        url: url,
        data: data,
        method: 'PUT'
      }).then ()->
        notify.success "修改头像成功"
        $('#local_image_upload').show();
        $('#savePic').hide();
        $('img.img-thumbnail').attr 'src', file.path
  })

  $("#userForm").validate ($form)->
    data = $form.serializeObject()
    url = "/api/v1/schools/#{GLOBAL.user._id.toString()}"
    $.ajax({
      url: url,
      data: data,
      method: 'PUT'
    }).then ()->
      notify.success '修改信息成功'


  $("#passwordForm").validate ($form)->
    data = $form.serializeObject()
    $.ajax({
      url: '/api/v1/auth/modifyPassword',
      data: data,
      method: 'PUT'
    }).then ()->
      notify.success '修改密码成功'



