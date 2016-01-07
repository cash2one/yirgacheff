'use strict';

Vue = require 'vue'
SingleSelect = require './singleSelect'
ImageSelect = require './imageSelect'
FillBlank = require './fillBlank'
Voice = require './voice'

TITLES = ['单选题', '图片选择题', '填空题', '语音题']
QuizComponent = Vue.extend(
  props: ['exercise', 'index']
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
                <exercise-select v-if='exercise.eType === 0' :index='index' :exercise='exercise' v-ref:child></exercise-select>
                <exercise-image v-if='exercise.eType === 1' :index='index' :exercise='exercise' v-ref:child></exercise-image>
                <exercise-fill v-if='exercise.eType === 2' :index='index' :exercise='exercise' v-ref:child></exercise-fill>
                <exercise-voice v-if='exercise.eType === 3' :index='index' :exercise='exercise' v-ref:child></exercise-voice>
            </div>
        </div>
   </div>
  """

  components:
    'exercise-select': SingleSelect
    'exercise-fill': FillBlank
    'exercise-voice': Voice
    'exercise-image': ImageSelect


  created: ()->
    this.exercise.sequence = this.index + 1

  computed:
    title: ()->
      TITLES[this.exercise.eType]

  methods:
    delete: ()->
      this.$dispatch('delete-exercise', this.index)

    getData: ()->
      this.$refs.child.$data

    isValid: ()->
      this.$refs.child.isValid()
)

module.exports = QuizComponent



