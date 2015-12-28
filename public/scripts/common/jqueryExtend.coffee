'use strict';

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

#将数据写入表单内
$.fn.renderForm = (object)->
  setProperty = (self, outerKey, obj) ->
    for own key, value of obj
      fk = if outerKey? then "#{outerKey}.#{key}" else key
      type = typeof value
      if type isnt 'object'
        input = $(self).find("input[name=#{fk}]", "select[name=#{fk}]", "textarea[name=#{fk}]");
        if input.length > 0
          input.val(value)
      else
        setProperty(self, fk, value)
  setProperty($(this), null, object)
