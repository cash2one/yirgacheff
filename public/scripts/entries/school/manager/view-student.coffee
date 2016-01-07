app = require '../../../common/app'

$ ->
  app();
  #µç»°¼ÇÂ¼
  $('#recordList').on 'click', '.panel-collapse', ()->
    $(this).closest(".panel").children('.panel-body').slideToggle('fast');

  $('#scoresList').on 'click', '.panel-collapse', ()->
    $(this).closest(".panel").children('.panel-body').slideToggle('fast');
