Vue = require 'vue'
_ = require 'underscore'
notify = require '../../common/notify'

OPTIONS = ['A', 'B', 'C', 'D']

#选项组件
OptionComponent = Vue.extend(
  props: ['option', 'index']
  template: """
       <div class="col-xs-12">
          <div class="input-group m-b-md">
            <span class="input-group-addon">{{option.title}}</span>
            <input type="text" class="form-control" placeholder="请填写选项内容" v-model='option.content'>
            <span v-if='canDelete'>
                 <a class="f-s-18 f-gray m-r-lg input-times" @click='handleDelete'><i class="fa fa-times"></i></a>
            </span>
          </div>
      </div>
  """
  created: ()->
    this.option.title ?= this.title

  methods:
    handleDelete: ()->
      this.$dispatch('delete-option', this.index)

  computed:
    canDelete: ()->
      this.$parent.choices.length > 2
    title: ()->
      OPTIONS[this.index]
)


#选择题
SelectComponent = Vue.extend(
  props: ['index', 'quiz']
  template: """
   <div class='row quiz-item'>
      <div class="col-xs-12 m-b-md">
            <input placeholder="这是一个单选题目" type="text" class="form-control" v-model='question'>
      </div>
      <quiz-option v-for='option in choices'
                   :index='$index'
                   :option='option'
                   @delete-option='deleteOption'>
      </quiz-option>

      <div class="col-xs-12 m-b-md">
         <a class="f-s-16 f-info btn btn-info btn-home btn-custom btn-block b-d" v-on:click='addOption'>
            <i class="fa fa-plus m-r-xs"></i>添加选项
         </a>
      </div>
      <div class="col-xs-12 m-b-md">
          <select class='form-control' v-model='answer'>
             <option value='' selected>选择答案</option>
             <option v-for="option in choices">
                {{getTitle($index)}}
            </option>
          </select>
      </div>
      <div class="col-xs-12">
        <textarea placeholder="答案解析" class="form-control" rows="3" v-model='analysis'></textarea>
      </div>
   </div>
  """

  data: ()->
    choices: [{}, {}]

  created: ()->
    _.extend this.$data, this.quiz
    delete this.$data['quiz']

  components:
    'quiz-option': OptionComponent

  methods:
    addOption: ()->
      len = this.choices.length
      if(len >= 4)
        return notify.warning "只能有4个选项哦"
      this.choices.push({
        title: OPTIONS[len]
      })

    deleteOption: (index)->
      this.choices.splice(index - 1, 1)
      this.$set('answer', '')

    getTitle: (index)->
      OPTIONS[index]

    isValid: ()->
      if _.isEmpty this.question
        notify.danger "第#{this.index + 1}题题目不能为空"
        return false
      for opt,i in this.choices
        if _.isEmpty opt.content
          notify.danger "第#{this.index + 1}题选项不能为空"
          return false
      if _.isEmpty this.answer
        notify.danger "第#{this.index + 1}题答案不能为空"
        return false
      true
)

module.exports = SelectComponent