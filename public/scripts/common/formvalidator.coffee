require 'validate-js'
notify = require './notify'

$.fn.extend
  validate: (opts, callback)->
    if this.data("instance")
      return
    $this = this
    fields = []
    submit = false
    if typeof opts is 'function'
      cb = opts
    else
      cb = callback
      submit = opts.submit
    $this.find(".validate").each (i, el)->
      $el = $(el)
      fields.push
        name: $el.attr "name"
        rules: $el.attr "data-rules"
        display: $el.attr "data-display"

    validator = new FormValidator $this.attr('name'), fields, (errors, event) ->
      if not submit
        event.preventDefault()
      $this.find(".error").removeClass "error"
      if errors.length > 0
        notify.danger errors[0].message
        $.each errors, (index, err)->
          $target = $this.find("*[id='" + err.id + "']")
          $target.closest(".control-group").removeClass("error").addClass "error"
        return false

      if cb and typeof cb is "function"
        cb $this, $this.serializeObject()

    for own key,val of messages
      validator.setMessage key, val

    this.data "instance", validator

messages =
  required: '请填写%s'
  matches: '%s与%s不一致'
  "default": 'The %s field is still set to default, please change.'
  valid_email: '%s不是邮箱格式'
  valid_emails: 'The %s field must contain all valid email addresses.'
  min_length: '%s不能小于%s位'
  max_length: '%s不能大于%s位'
  exact_length: 'The %s field must be exactly %s characters in length.'
  greater_than: '%s只能是大于%s的数字'
  less_than: '%s 只能是小于 %s 的数字'
  alpha: 'The %s field must only contain alphabetical characters.'
  alpha_numeric: 'The %s field must only contain alpha-numeric characters.'
  alpha_dash: 'The %s field must only contain alpha-numeric characters, underscores, and dashes.'
  numeric: '%s只能包含数字'
  integer: '%s只能是整数'
  decimal: 'The %s field must contain a decimal number.'
  is_natural: 'The %s field must contain only positive numbers.'
  is_natural_no_zero: 'The %s field must contain a number greater than zero.'
  valid_ip: 'The %s field must contain a valid IP.'
  valid_base64: 'The %s field must contain a base64 string.',
  valid_credit_card: 'The %s field must contain a valid credit card number.',
  is_file_type: 'The %s field must contain only %s files.'
  valid_url: 'The %s field must contain a valid URL.'
  greater_than_date: 'The %s field must contain a more recent date than %s.',
  less_than_date: 'The %s field must contain an older date than %s.'
  greater_than_or_equal_date: 'The %s field must contain a date that\'s at least as recent as %s.'
  less_than_or_equal_date: 'The %s field must contain a date that\'s %s or older.'