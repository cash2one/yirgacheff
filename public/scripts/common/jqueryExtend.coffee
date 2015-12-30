'use strict';
_ = require 'lodash'

#序列化表单为javascript对象
$.fn.serializeObject = ()->
  obj = {}
  a = this.serializeArray()
  $.each a, ()->
    name = this.name
    value = this.value?= ''
    if obj[name]?
      if not obj[name].push?
        obj[name] = [obj[name]]
      obj[name].push value
    else
      obj[name] = value
  obj


#TODO 添加复杂对象处理
$.fn.renderForm = (object)->
  ps = this.serializeArray()
  $form = $(this)
  $.each ps, ()->
    name = this.name
    input = $form.find "[name='" + name + "']"
    if object[name]
      input.val object[name]



