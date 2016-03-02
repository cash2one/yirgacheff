_ = require 'underscore'
Vue = require 'vue'
notify = require '../../common/notify'
#语音题
VoiceComponent = Vue.extend(
  props: ['index', 'exercise']

  template: """
     <div class='row quiz-item'>
        <div class="col-xs-12">
            <textarea placeholder="例：请背诵新概念英语第一单元课文"
                  class="form-control" rows="3" cols='25' wrap='hard'
                  v-model='question'></textarea>
        </div>
     </div>
  """
  data: ()->
    question: ''
    eType: 3

  created: ()->
    _.extend this.$data, this.exercise
    delete this.$data['exercise']

  methods:
    getPlainData: ()->
      return {
        question: this.question
        eType: this.eType
      }


    isValid: ()->
      if _.isEmpty this.question
        notify.danger "第#{this.index + 1}题题目不能为空"
        return false
      true
)

module.exports = VoiceComponent

