Vue = require 'vue'
colors = [
  "#fff45c", "#fde800", "#ffcb15", "#ffa921", "#ff691f", "#ff391f",
  "#c53f46", "#d6004a", "#ff1d6b", "#ff4da9", "#ff80c5", "#ffb4ce",
  "#ddf56d", "#b0f346", "#6fe113", "#87c943", "#129527", "#059d7f",
  "#00589c", "#4676d9", "#4e99df", "#5faaff", "#3abcff", "#70d8ff",
  "#cccccc", "#999999", "#666666", "#333333", "#000000"
]
template = """
<div class="editor">
    <div class="wx-editor-template-list">
        <ul class="nav nav-tabs">
            <li class="active">
                <a href="#tab1" data-toggle="tab" @click="currentView='title'">
                    <div class="bg-color bg-success">
                        <i class="fa fa-header"></i>
                    </div>
                    标题
                </a>
            </li>
            <li>
                <a href="#tab2" data-toggle="tab" @click="currentView='content'">
                    <div class="bg-color bg-danger">
                        <i class="fa fa-file-o"></i>
                    </div>
                    正文
                </a>
            </li>
            <li>
                <a href="#tab3" data-toggle="tab" @click="currentView='follow'">
                    <div class="bg-color bg-info">
                        <i class="fa fa-thumbs-o-up"></i>
                    </div>
                    关注
                </a>
            </li>
            <li>
                <a href="#tab4" data-toggle="tab" @click="currentView='share'">
                    <div class="bg-color bg-warning">
                        <i class="fa fa-share-square-o"></i>
                    </div>
                    分享
                </a>
            </li>
            <li>
                <a href="#tab5" data-toggle="tab" @click="currentView='festival'">
                    <div class="bg-color bg-pink">
                        <i class="fa fa-gift"></i>
                    </div>
                    节日
                </a>
            </li>
            <li>
                <a href="#tab6" data-toggle="tab" @click="currentView='gallery'">
                    <div class="bg-color bg-primary">
                        <i class="fa fa-picture-o"></i>
                    </div>
                    图库
                </a>
            </li>
            <li class="dropdown">
                <a href="#" class="dropdown-toggle"
                   data-toggle="dropdown">
                    <div class="bg-color f-white" style="background-color: #72d26e;">
                        <i class="fa fa-cog"></i>
                    </div>
                    颜色
                </a>
                <ul class="dropdown-menu colorpick-w" role="menu" aria-labelledby="myTabDrop1">
                    <li>
                        <div class="colorpick">
                            <ul class="list-unstyled">
                                <li v-for="color in colors" style="background-color: {{color}};" @click='selectColor(color)'></li>
                            </ul>
                        </div>
                    </li>
                </ul>
            </li>
        </ul>
    </div>
    <div class="wx-editor-template-content">
        <div class="tab-content slimscroll">
            <div class="tab-pane fade in active">
              <component :is="currentView"></component>
            </div>
        </div>
    </div>
</div>
"""
WXEditor = Vue.extend
  template: template
  data: ()->
    currentView: 'title'
    colors: colors



  components:
    title: (resolve)-> require ['./ui/Title'], resolve
    content: (resolve)-> require ['./ui/Content'], resolve
    follow: (resolve)-> require ['./ui/Follow'], resolve
    share: (resolve)-> require ['./ui/Share'], resolve
    festival: (resolve)-> require ['./ui/Festival'], resolve
    gallery: (resolve)-> require ['./ui/Gallery'], resolve

  methods:
    selectColor: (color)->
      this.$broadcast 'change-color', color

  ready: ()->
    $('.slimscroll').slimscroll
      alwaysVisible: false
      allowPageScroll: false
      height: "auto"

  events:
    'element-select': (e)->
      this.$dispatch('ui-select', e)

    'image-select': (e)->
      this.$dispatch('ui-select', e)


module.exports = WXEditor