require 'bootstrap'
require 'slimscroll'
require './jqueryExtend';

module.exports = ()->
  $('.slimscroll').slimscroll({
    allowPageScroll: true
  })

  $('#gotop').click ()->
    $(document).scrollTop(0)



