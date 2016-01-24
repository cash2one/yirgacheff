_ = require 'underscore'
module.exports =
  created: ()->
    _.extend this.$data, this.exercise
    delete this.$data['exercise']
