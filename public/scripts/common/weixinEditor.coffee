#微信编辑器事件

upload = require './uploadifive'
constants = require './constants'
RESOURCE_URL = constants.RESOURCE_URL

template = (image)->
  """
  <li class='item'>
    <img src='#{RESOURCE_URL}#{image.key}' alt='' class='img-thumbnail'>
  </li>
 """

module.exports = (opts)->
  editor = opts.editor;

  #颜色切换
  $('.colorpick').on 'click', 'li', (event)->
    event.preventDefault()
    color = $(this).css('background-color');
    event.stopPropagation();
    alert "选择颜色" + color

  #绑定组件点击事件
  $('.wx-editor-template-content').on 'click', '.item', ()->
    content = $(this).html()
    editor.execCommand('insertHtml',content);

  $.get '/api/v1/medias', (images)->
    templates = images.map template
    $("#weixinGallery").append(templates.join '')


  #初始化图库上传功能
  upload({
    button: 'weixinEditorImgUpload',
    multi: true,
    done: (uploads)->
      $.post('/api/v1/medias', {uploads: uploads}).then ()->
        templates = uploads.map template
        firstItem = $("#weixinGallery").find(".item:first")
        $(templates.join '').insertBefore firstItem
  })


