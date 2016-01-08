notify = require '../../../common/notify'
_ = require 'underscore'

OPTIONS = ['A', 'B', 'C', 'D']
module.exports =
  data: ()->
    question: ''
    analysis: ''
    answer: ''
    choices: [{}, {}]

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
      this.answer = ''

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

