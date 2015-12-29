require 'bootstrap'
require 'slimscroll'
require './jqueryExtend';

module.exports = ()->
  $('.slimscroll').slimscroll({
    alwaysVisible: false
    allowPageScroll: false
    height:"auto"
  })

  $('#gotop').click ()->
    $(document).scrollTop(0)



