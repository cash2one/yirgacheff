Vue = require 'vue'

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
                                <li style="background-color: #fff45c;"></li>
                                <li style="background-color: #fde800;"></li>
                                <li style="background-color: #ffcb15;"></li>
                                <li style="background-color: #ffa921;"></li>
                                <li style="background-color: #ff691f;"></li>
                                <li style="background-color: #ff391f;"></li>
                                <li style="background-color: #c53f46;"></li>
                                <li style="background-color: #d6004a;"></li>
                                <li style="background-color: #ff1d6b;"></li>
                                <li style="background-color: #ff4da9;"></li>
                                <li style="background-color: #ff80c5;"></li>
                                <li style="background-color: #ffb4ce;"></li>
                                <li style="background-color: #ddf56d;"></li>
                                <li style="background-color: #b0f346;"></li>
                                <li style="background-color: #6fe113;"></li>
                                <li style="background-color: #87c943;"></li>
                                <li style="background-color: #129527;"></li>
                                <li style="background-color: #059d7f;"></li>
                                <li style="background-color: #00589c;"></li>
                                <li style="background-color: #4676d9;"></li>
                                <li style="background-color: #4e99df;"></li>
                                <li style="background-color: #5faaff;"></li>
                                <li style="background-color: #3abcff;"></li>
                                <li style="background-color: #70d8ff;"></li>
                                <li style="background-color: #cccccc;"></li>
                                <li style="background-color: #999999;"></li>
                                <li style="background-color: #666666;"></li>
                                <li style="background-color: #333333;"></li>
                                <li style="background-color: #000000;"></li>
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

  ready: ()->
    $('.slimscroll').slimscroll
      alwaysVisible: false
      allowPageScroll: false
      height: "auto"
  components:
    title: (resolve)-> require ['./ui/Title'], resolve
    content: (resolve)-> require ['./ui/Content'], resolve
    follow: (resolve)-> require ['./ui/Follow'], resolve
    share: (resolve)-> require ['./ui/Share'], resolve
    festival: (resolve)-> require ['./ui/Festival'], resolve
    gallery: (resolve)-> require ['./ui/Gallery'], resolve

  events:
    'element-select': (e)->
      this.$dispatch('ui-select', e)

    'image-select': (e)->
      this.$dispatch('ui-select', e)


module.exports = WXEditor