require '../../../common/formvalidator'
app = require '../../../common/app'


$ ->
  app();
  studentId = $('#studentId').val()

  $('#recordForm').validate ($form, data)->
    url = '/api/v1/connections/students/' + studentId
    $.post(url, data).then ()->
      self.location.href = ''


  $('#recordList').on 'click', '.panel-collapse', ()->
    $(this).closest(".panel").children('.panel-body').slideToggle('fast');

  $('#scoresList').on 'click', '.panel-collapse', ()->
    $(this).closest(".panel").children('.panel-body').slideToggle('fast');
