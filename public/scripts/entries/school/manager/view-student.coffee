app = require '../../../common/app'

$ ->
  app();
  #�绰��¼
  $('#recordList').on 'click', '.panel-collapse', ()->
    $(this).closest(".panel").children('.panel-body').slideToggle('fast');

  $('#scoresList').on 'click', '.panel-collapse', ()->
    $(this).closest(".panel").children('.panel-body').slideToggle('fast');
