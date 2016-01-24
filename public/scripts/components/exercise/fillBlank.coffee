Vue = require 'vue'
notify = require '../../common/notify'
_ = require 'underscore'
#填空题
FillBlankComponent = Vue.extend(
  props: ['index', 'exercise']

  template: """
     <div class='row quiz-item'>
        <div class="col-xs-12 m-b-md">
            <textarea class="form-control question-title" placeholder="这是一个填空题目"
            onpropertychange="this.style.height=this.scrollHeight + 'px'"
            oninput="this.style.height=this.scrollHeight + 'px'" v-model='question'></textarea>
        </div>
        <div class="col-xs-12 m-b-md">
            <input placeholder="答案" type="text" class="form-control" v-model='answer'>
        </div>
        <div class="col-xs-12">
            <textarea placeholder="答案解析" class="form-control " rows="3" v-model='analysis'></textarea>
        </div>
     </div>
  """
  data: ()->
    question: ''
    answer: ''
    analysis: ''

  created: ()->
    _.extend this.$data, this.exercise
    delete this.$data['exercise']

  methods:
    isValid: ()->
      if _.isEmpty this.question
        notify.danger "第#{this.index + 1}题题目不能为空"
        return false

      if _.isEmpty this.answer
        notify.danger "第#{this.index + 1}题答案不能为空"
        return false
      true
)

module.exports = FillBlankComponent

