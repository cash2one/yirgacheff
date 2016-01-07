OPTIONS = ['A', 'B', 'C', 'D']
module.exports =
  methods:
    handleDelete: ()->
      this.$dispatch('delete-option', this.index)

  computed:
    canDelete: ()->
      this.$parent.choices.length > 2
    title: ()->
      OPTIONS[this.index]