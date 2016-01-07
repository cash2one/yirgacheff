'use strict';

Vue = require 'vue'
SingleSelect = require './singleSelect'
ImageSelect = require './imageSelect'
FillBlank = require './fillBlank'
Voice = require './voice'

TITLES = ['单选题', '图片选择题', '填空题', '语音题']
QuizComponent = Vue.extend(
  props: ['quiz', 'index']
  template: """
   <div class="col-xs-offset-1 col-xs-10 buildUp">
        <div class="panel panel-white panel-b">
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
                <quiz-select v-if='quiz.eType === 0' :index='index' :quiz='quiz' v-ref:child></quiz-select>
                <quiz-image v-if='quiz.eType === 1' :index='index' :quiz='quiz' v-ref:child></quiz-image>
                <quiz-fill v-if='quiz.eType === 2' :index='index' :quiz='quiz' v-ref:child></quiz-fill>
                <quiz-voice v-if='quiz.eType === 3' :index='index' :quiz='quiz' v-ref:child></quiz-voice>
            </div>
        </div>
   </div>
  """

  components:
    'quiz-select': SingleSelect
    'quiz-fill': FillBlank
    'quiz-voice': Voice
    'quiz-image': ImageSelect


  created: ()->
    this.quiz.sequence = this.index + 1

  computed:
    title: ()->
      TITLES[this.quiz.eType]

  methods:
    delete: ()->
      this.$dispatch('delete-quiz', this.index)

    getData: ()->
      this.$refs.child.$data

    isValid: ()->
      this.$refs.child.isValid()
)

module.exports = QuizComponent



