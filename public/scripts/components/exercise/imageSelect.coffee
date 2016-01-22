Vue = require 'vue'
upload = require '../../common/uploadifive'
constants = require '../../common/constants'
selectMixin = require './mixins/selectMixin'
exerciseMixin = require './mixins/exerciseMixin'
optionMixin = require './mixins/optionMixin'

#选项组件
OptionComponent = Vue.extend
  props: ['option', 'index', 'seq']
  mixins: [optionMixin]
  template: """
      <div class="col-xs-3">
         <span>{{title}}</span>
         <div class="images-upload m-t-xs">
             <img v-bind:src='imagePath' alt='' width='130' height='130'>
         </div>
         <div class='upload-control'>
             <a class='f-info pull-left' id='upload-{{seq}}-{{index}}'>{{uploadText}}</a>
             <a class='f-pink pull-right' @click="handleDelete" v-show="canDelete">删除</a>
         </div>
     </div>
  """
  data: ()->
    imagePath: '/images/icon-upload.png'
    uploadText: '上传'

  created: ()->
    if this.option.content
      this.imagePath = constants.RESOURCE_URL + this.option.content

  ready: ()->
    self = this
    upload
      button: "upload-#{this.seq}-#{this.index}"
      multi: false
      done: (res)->
        file = res[0]
        self.$set('imagePath', file.path)
        self.option.content = file.key
        self.uploadText = '重新上传'


#图片选择题
ImageComponent = Vue.extend
  props: ['index', 'exercise']
  mixins: [exerciseMixin, selectMixin]
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
                   @delete-option='deleteOption'>
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
          <textarea placeholder="答案解析" class="form-control" rows="3" v-model='analysis'></textarea>
        </div>
     </div>
  """
  components:
    'e-option': OptionComponent

module.exports = ImageComponent