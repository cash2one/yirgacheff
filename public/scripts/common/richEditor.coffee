#Created by Frank on 15/8/7.

require 'simditor/styles/simditor.css'
require 'expose?Simditor!simditor'

module.exports.render = (elemId) ->
  new Simditor({
    textarea: $('#' + elemId),
    placeholder: '写点什么...'
    toolbar: [
      'title'
      'bold'
      'italic'
      'underline'
      'strikethrough'
      'fontScale'
      'color'
      'ol'             # ordered list
      'ul'             # unordered list
      'blockquote'
      'table'
      'link'
      'image'
      'hr'             # horizontal ruler
      'indent'
      'outdent'
      'alignment'
    ]
  })

