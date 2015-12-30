app = require '../../common/app'
upload = require '../../common/uploadifive'
$http = require '../../common/restfulClient'

$ ->
  app()
  upload({
    file: 'imageUpload',
    done: (file)->
      url = "/api/v1/teachers/#{GLOBAL.user._id.toString()}"
      data = avatar: file.key
      $('img.avatar').attr 'src', file.path
      $http.put url, data, ()->
        layer.msg('修改头像成功!');
        $('#local_image_upload').show();
        $('#savePic').hide();
  })

  $('#info-save-btn').click ()->
    data = $('#infoForm').serializeObject();
    if data.displayName is ''
      return layer.msg '姓名不能为空'

    if data.contact is ''
      return layer.msg '联系方式不能为空'
    url = "/api/v1/teachers/#{GLOBAL.user._id.toString()}?me=true"
    $http.put url, data, ()->
      layer.msg '修改信息成功'

  #修改密码
  $('#change-psw-btn').click ()->
    data = $('#passwordForm').serializeObject();
    if  data.password is ''
      return layer.msg('原始密码不能为空')

    if data.newPassword is ''
      return layer.msg('新密码不能为空');

    if data.newPassword isnt data.confirmPassword
      return layer.msg('两次密码输入不一致');

    $http.put '/api/v1/auth/modifyPassword', data, ()->
      layer.msg('修改密码成功!')


