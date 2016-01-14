require 'froala-editor/css/froala_editor.css'
require 'froala-editor/css/froala_style.css'

#插件样式
require 'froala-editor/css/themes/royal.min.css'
require 'froala-editor/css/plugins/image.min.css'
require 'froala-editor/css/plugins/table.min.css'
require 'froala-editor/css/plugins/video.min.css'
require 'froala-editor/css/plugins/code_view.min.css'
require 'froala-editor/css/plugins/line_breaker.min.css'

require 'froala-editor/js/froala_editor.min'
require 'froala-editor/js/languages/zh_cn'

#加载插件
require 'froala-editor/js/plugins/font_size.min'
require 'froala-editor/js/plugins/link.min'
require 'froala-editor/js/plugins/url.min'
require 'froala-editor/js/plugins/lists.min'
require 'froala-editor/js/plugins/image.min'
require 'froala-editor/js/plugins/table.min'
require 'froala-editor/js/plugins/video.min'
require 'froala-editor/js/plugins/line_breaker.min'
require 'froala-editor/js/plugins/code_view.min'


Vue = require 'vue'

toolbarButtons = ['insertHTML', 'bold', 'italic', 'underline', 'strikeThrough', 'fontSize', '|', 'color',
  'emoticons', 'inlineStyle', 'paragraphStyle', '|', 'paragraphFormat', 'align',
  'formatOL', 'formatUL', 'outdent', 'indent', 'quote', 'insertHR', '-', 'insertLink', 'insertImage', 'insertVideo',
  'insertFile', 'insertTable', 'undo', 'redo', 'clearFormatting', 'selectAll', 'html']

$.extend($.FroalaEditor.POPUP_TEMPLATES, {
  'customPlugin.popup': '[_BUTTONS_][_CUSTOM_LAYER]'
})

$.extend($.FroalaEditor.DEFAULTS, {
  popupButtons: ['popupClose', '|', 'popupButton1', 'popupButton2'],
});






Editor = Vue.extend

  props: ['id', 'name', 'height']
  template: """
     <textarea id='{{id}}' name='{{name}}'></textarea>
  """

  ready: ()->
    self = this
    $.FroalaEditor.DefineIcon('insertHTML', {NAME: 'plus'});
    $.FroalaEditor.RegisterCommand 'insertHTML',
      title: 'Insert HTML'
      focus: true
      undo: true
      refreshAfterCallback: true
      callback: (element)->
        this.html.insert(element);
        this.undo.saveStep()

    $("##{this.id}").on 'froalaEditor.initialized', (e, editor) -> self.editor = editor
    .froalaEditor
        theme: 'royal'
        language: 'zh_cn'
        height: this.height || 620
        heightMax: this.height || 620
        toolbarSticky: false
        zIndex: 1024
        toolbarButtons: toolbarButtons
        imageInsertButtons: ['imageBack', 'imageByURL']
        imageEditButtons: ['imageReplace', 'imageAlign', 'imageRemove', '|',
          'imageLink', 'linkOpen', 'linkEdit', 'linkRemove', '-',
          'imageDisplay', 'imageStyle', 'imageAlt', 'imageSize']


  events:
    'insertHtml': (element)->
      this.editor.html.insert(element)

module.exports = Editor;



