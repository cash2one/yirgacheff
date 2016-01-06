_ = require 'underscore'
notify = require '../common/notify'
OPTIONS = ['A', 'B', 'C', 'D']

#选项组件
OptionComponent = Vue.extend(
  props: ['option', 'index']
  template: """
       <div class="col-xs-12">
         <div class="input-group m-b-md">
            <span class="input-group-addon">{{title}}</span>
            <input type="text" class="form-control" placeholder="请填写选项内容" v-model='option.content'>
            <span v-if='canDelete'>
                 <a class="f-s-18 f-gray m-r-lg input-times" v-on:click='handleDelete'><i class="fa fa-times"></i></a>
            </span>
         </div>
      </div>
  """
  created: ()->
    this.option.title = this.title

  methods:
    handleDelete: ()->
      this.$dispatch('delete', this.index)
  computed:
    canDelete: ()->
      true
    title: ()->
      OPTIONS[this.index]
)


#文字选择题
TextSelectComponent = Vue.extend(
  props: ['index', 'quiz']
  template: """
      <div class="col-xs-12 m-b-md">
        <div class="input-group">
            <input placeholder="这是一个单选题目" type="text" class="form-control">

            <div class="input-group-btn">
                <button type="button" class="btn btn-white btn-option dropdown-toggle"
                        data-toggle="dropdown" aria-expanded="false">{{answer}}
                </button>
                <span class="caret answerIcon"></span>
                <ul class="dropdown-menu" role="menu">
                    <li v-for="option in choices" v-on:click='chooseAnswer($index)'>
                        {{getTitle($index)}}
                    </li>
                </ul>
            </div>
        </div>
      </div>
      <quiz-option v-for='option in choices'
                   :index='$index'
                   :option='option'
                   v-on:delete='deleteOption'>
      </quiz-option>

      <div class="col-xs-12 m-b-md">
         <a class="f-s-16 f-info btn btn-info btn-home btn-custom btn-block b-d" v-on:click='addOption'>
            <i class="fa fa-plus m-r-xs"></i>添加选项
         </a>
      </div>
      <div class="col-xs-12">
        <textarea placeholder="答案解析" class="form-control" rows="3" v-model='analysis'></textarea>
      </div>
  """

  data: ()->
    _.extend {}, this.quiz, {
      answer: '选择答案'
      choices: [{}, {}],
      analysis: ''
      sequence: this.index
    }

  components:
    'quiz-option': OptionComponent

  events:
    validate: ()->


  methods:
    addOption: ()->
      len = this.choices.length
      console.log this.choices
      if(len >= 4)
        return
      this.choices.push({
        title: OPTIONS[len]
      })

    deleteOption: (index)->
      this.choices.splice(index - 1, 1)

    chooseAnswer: (index)->
      this.answer = OPTIONS[index]

    getTitle: (index)->
      OPTIONS[index]
)

module.exports = TextSelectComponent