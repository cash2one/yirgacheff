'use strict';

TextSelect = require './textSelect'

TITLES = ['单选题', '图片选择题', '填空题', '语音题']
QuizComponent = Vue.extend(
  props: ['quiz', 'index']
  template: """
   <div class="col-xs-offset-1 col-xs-10 buildUp">
        <div class="panel b">
            <div class="panel-heading">
                <div class="quest-title">
                    <div class="quest-number">{{index+1}}</div>
                    {{title}}
                </div>
                <div class="panel-control">
                    <a href="javascript:void(0);" data-toggle="tooltip" data-placement="top" title="Expand/Collapse"
                       class="panel-collapse"><i class="fa fa-arrow-circle-o-down"></i></a>
                    <a href="javascript:void(0);" data-toggle="tooltip" data-placement="top" title="Remove"
                       v-on:click='delete'
                       class="panel-remove"><i class="fa fa-times-circle-o"></i></a>
                </div>
            </div>
            <div class="panel-body">
                <div class="row quiz-item">
                    <text-select v-if='quiz.eType === 0' :index='index' :quiz='quiz'></text-select>
                </div>
            </div>
        </div>
   </div>
  """

  components:
    'text-select': TextSelect

  computed:
    title: ()->
      TITLES[this.quiz.eType]

  methods:
    delete: ()->
      this.$dispatch('delete', this.index)
)

Vue.component('quiz', QuizComponent)



