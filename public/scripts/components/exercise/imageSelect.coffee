Vue = require 'vue'
_ = require 'underscore'
upload = require '../../common/uploadifive'
notify = require '../../common/notify'
constants = require '../../common/constants'

OPTIONS = ['A', 'B', 'C', 'D']

#选项组件
OptionComponent = Vue.extend(
  props: ['option', 'index', 'seq']
  template: """
      <div class="col-xs-3">
         <span>{{title}}</span>
         <div class="images-upload m-t-xs">
             <img v-bind:src='imagePath' alt='' width='130' height='130'>
         </div>
         <div class='upload-control'>
             <a class='f-info pull-left image-option-upload'>{{uploadText}}</a>
             <a class='f-pink pull-right' @click="handleDelete" v-show="canDelete">删除</a>
         </div>
     </div>
  """
  data: ()->
    imagePath: '/images/icon-upload.png'
    uploadText: '上传'

  created: ()->
    this.option.title ?= this.title
    if this.option.content
      this.imagePath = constants.RESOURCE_URL + this.option.content

  ready: ()->
    self = this
    upload({
      button: $('.image-option-upload')
      multi: false
      done: (res)->
        self.$set('imagePath', res.path)
        self.option.content = res.key
        self.uploadText = '重新上传'
    })

  methods:
    handleDelete: ()->
      this.$dispatch('delete-option', this.index)

  computed:
    canDelete: ()->
      this.$parent.choices.length > 2
    title: ()->
      OPTIONS[this.index]
)


#图片选择题
ImageComponent = Vue.extend(
  props: ['index', 'exercise']
  template: """
      <div class='row quiz-item'>
        <div class="col-xs-12 m-b-md">
              <input placeholder="这是一个图片题" type="text" class="form-control" v-model='question'>
        </div>
        <div class="col-xs-12 m-b-md">
             <e-option v-for='option in choices'
                   :index='$index'
                   :option='option'
                   :seq='index'
                   v-on:delete-option='deleteOption'>
             </e-option>
        </div>
        <div class="col-xs-12 m-t-lg m-b-lg">
           <a class="f-s-16 f-info btn btn-info btn-custom btn-home btn-block b-d"
                     data-id="image" @click='addOption'>
              <i class="fa fa-plus m-r-xs"></i>添加选项
           </a>
        </div>
        <div class="col-xs-12 m-b-md">
          <select class='form-control' v-model='answer'>
             <option value=''>选择答案</option>
             <option v-for="option in choices">
                {{getTitle($index)}}
            </option>
          </select>
       </div>
        <div class="col-xs-12 m-t-xs">
          <textarea placeholder="答案解析" class="form-control" rows="3"></textarea>
        </div>
     </div>
  """

  data: ()->
    question: ''
    analysis: ''
    answer: ''
    choices: [{}, {}]

  created: ()->
    _.extend this.$data, this.exercise
    delete this.$data['exercise']

  components:
    'e-option': OptionComponent

  methods:
    addOption: ()->
      len = this.choices.length
      if(len >= 4)
        return notify.warning "只能有4个选项哦"
      this.choices.push({
        title: OPTIONS[len]
      })

    deleteOption: (index)->
      this.choices.splice(index, 1)
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

module.exports = ImageComponent