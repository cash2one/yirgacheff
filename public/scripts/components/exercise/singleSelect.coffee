Vue = require 'vue'
selectMixin = require './mixins/selectMixin'
exerciseMixin = require './mixins/exerciseMixin'
optionMixin = require './mixins/optionMixin'

#选项组件
OptionComponent = Vue.extend
  props: ['option', 'index']
  mixins: [optionMixin]
  template: """
       <div class="col-xs-12">
          <div class="input-group m-b-md">
            <span class="input-group-addon">{{title}}</span>
            <input type="text" class="form-control" placeholder="请填写选项内容" v-model='option.content'>
            <span v-show='canDelete'>
                 <a class="f-s-18 f-gray m-r-lg input-times" @click='handleDelete'><i class="fa fa-times"></i></a>
            </span>
          </div>
      </div>
  """

#选择题
SelectComponent = Vue.extend
  props: ['index', 'exercise']
  mixins: [exerciseMixin, selectMixin]
  template: """
   <div class='row quiz-item'>
      <div class="col-xs-12 m-b-md">
            <textarea class="form-control question-title" placeholder="这是一个单选题目"
            onpropertychange="this.style.height=this.scrollHeight + 'px'"
            oninput="this.style.height=this.scrollHeight + 'px'" v-model='question'></textarea>
      </div>
      <e-option v-for='option in choices'
                   :index='$index'
                   :option='option'
                   @delete-option='deleteOption'>
      </e-option>

      <div class="col-xs-12 m-b-md">
         <a class="f-s-16 f-info btn btn-info btn-home btn-custom btn-block b-d" v-on:click='addOption'>
            <i class="fa fa-plus m-r-xs"></i>添加选项
         </a>
      </div>
      <div class="col-xs-12 m-b-md">
          <select class='form-control' v-model='answer'>
             <option value='' >选择答案</option>
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
  components:
    'e-option': OptionComponent

module.exports = SelectComponent