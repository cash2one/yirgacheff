notify = require '../../../common/notify'
_ = require 'underscore'

OPTIONS = ['A', 'B', 'C', 'D']
module.exports =
  data: ()->
    question: ''
    analysis: ''
    answer: ''
    choices: [{'title': 'A'}, {'title': 'B'}]


  methods:
    addOption: ()->
      len = this.choices.length
      if len >= 4
        return notify.warning "只能有4个选项哦"
      this.choices.push
        title: OPTIONS[len]

    deleteOption: (index)->
      this.choices.splice(index, 1)
      _.forEach this.choices, (c, i)->
        c.title = OPTIONS[i]
      this.answer = ''

    getTitle: (index)->
      OPTIONS[index]

    getPlainData: ()->
      return {
        question: this.question,
        analysis: this.analysis,
        answer: this.answer,
        choices: this.choices
      }

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

