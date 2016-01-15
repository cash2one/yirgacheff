Vue = require 'vue'

EnrollField = Vue.extend({
  props: ['field', 'index']
  template: """
      <div class='form-group enroll-field'>
          <label class='control-label col-xs-2'>
             {{field.label || '自定义'}}
           </label>
           <div class='col-xs-10'>
              <input class='form-control' type='text'
              v-model='field.label'>
              <i class='fa fa-times f-gray f-s-16 pull-right m-t-n-lg m-r-xs' @click='delete'></i>
          </div>
      </div>
   """
  methods:
    delete: ()->
      this.$dispatch('delete', this.index)
})

Enroll = Vue.extend
  props: ['fields','readonly']

  components:
    'enroll-field': EnrollField


  template: """
  <div class="row m-b-md enrollarea">
      <div class="col-xs-9">
          <p class="p f-s-16">联系方式<span class="m-l-lg f-red">(报名用户填写资料，必填)</span></p>
              <div class="form-group">
                  <label class="control-label col-xs-2"><span
                          class="f-red m-r-xs">*</span>姓名：</label>
                  <div class="col-xs-10">
                      <input class="form-control" type="text"
                             placeholder="报名者的用户名或昵称"
                             readonly>
                  </div>
              </div>
              <div class="form-group">
                  <label class="control-label col-xs-2"><span
                          class="f-red m-r-xs">*</span>手机：</label>

                  <div class="col-xs-10">
                      <input class="form-control" type="text" placeholder="报名者的手机号码"
                             readonly>
                  </div>
              </div>
              <p class="p f-s-16">附加信息</p>

              <div class="enroll-extras">
                  <slot></slot>
                  <enroll-field v-for='field in fields'
                  :field.sync='field'
                  :index='$index'
                  @delete='deleteField'>
                  </enroll-field>
              </div>
      </div>
      <div class="col-xs-3" v-show='!readonly'>
          <div class="add-column b p-h-md p-v-xs">
              <div>
                  <p class="f-s-14"><i class="fa fa-bars m-r-xs"></i>常用栏目</p>
              </div>
              <div class="b-t">
                  <ul class="list-unstyled">
                      <li>
                          <button type="button" class="enroll-field-btn" @click='addField("住址")'>
                              <i class="fa fa-map-marker m-r-xs"></i>住址
                          </button>
                      </li>
                      <li>
                          <button type="button" class="enroll-field-btn" @click='addField("邮箱")'>
                              <i class="fa fa-envelope-o m-r-xs"></i>邮箱
                          </button>
                      </li>
                      <li>
                          <button type="button" class="enroll-field-btn" @click='addField("性别")'>
                              <i class="fa fa-mars m-r-xs"></i>性别
                          </button>
                      </li>
                      <li>
                          <button type="button" class="enroll-field-btn" @click='addField("兴趣爱好")'>
                              <i class="fa fa-futbol-o m-r-xs"></i>兴趣爱好
                          </button>
                      </li>
                      <li>
                          <button type="button" class="enroll-field-custom" @click='addField("自定义")'>
                              <i class="fa fa-pencil m-r-xs"></i>自定义
                          </button>
                      </li>
                  </ul>
              </div>
          </div>
      </div>
  </div>
  """
  methods:
    addField: (labelText)->
      this.fields.push
        label: labelText

    deleteField: (index)->
      this.fields.splice(index, 1)

module.exports = Enroll