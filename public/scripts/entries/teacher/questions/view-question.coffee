#  Created by Frank on 15/12/30.

require '../../../common/formvalidator'
app = require '../../../common/app'
notify = require '../../../common/notify'

$ ->
  app();
  $("#answerForm").validate ($form) ->
    data = $form.serializeObject()
    $.ajax({
      url: '/api/v1/questions/' + $("#questionId").val()
      method: 'PUT',
      data: data
    }).then (res)->
      notify.success("添加答案成功")





