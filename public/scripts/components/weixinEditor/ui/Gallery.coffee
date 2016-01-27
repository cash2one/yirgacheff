upload = require('../../../common/uploadifive');
Vue = require 'vue'
Vue.use (require 'vue-async-data')
Vue.filter 'visit', (value)->
  "http://resource.hizuoye.com/#{value}-gallery"

template = """
  <ul class="list-unstyled images-list" id="weixinGallery">
       <li>
          <a class="" href="javascript:void(0)" id="weixinEditorImgUpload">
              <div class="upload-btn"></div>
          </a>
       </li>
      <li class='img-item' v-for='image in images'>
        <div class='img-box'><img :src='image.key | visit' alt='' class='img-thumbnail'></div>
        <div class='img-controls' style='display: none'>
            <a href='javascript:void(0)' @click='selectImage'>
               <div class='add-img'>
                    <i class='fa fa-plus f-info'></i>
               </div>
            </a>
            <a class="deleteImg" href='javascript:void(0)' @click='deleteImage($index)'>
               <div class='delete-img'>
                    <i class='icon icon-shanchu f-pink'></i>
               </div>
            </a>
        </div>
      </li>
  </ul>
"""

#防止多次查询图片,使用全局变量
images = []
Gallery = Vue.extend
  data: ()->
    images: images

  activate: (done)->
    if images.length > 0
      return done()
    $.get '/api/v1/medias', (imgs)=>
      images = imgs
      this.images = images
      done()
  template: template
  methods:
    selectImage: (event)->
      img = $(event.target).closest('.img-item').find('.img-box').html()
      img = img.replace('-gallery', '')
      this.$dispatch 'image-select', img

    deleteImage: (index)->
      self = this
      if confirm("确定删除图片?")
        $.ajax(
          data:
            medias: self.images[index].key
          url: '/api/v1/medias'
          method: 'DELETE'
        ).then ()->
          self.images.splice(index, 1)

  ready: ()->
    self = this
    $('#weixinGallery').on 'mouseover', '.img-item', ()->
      $(this).find('.img-controls').show()

    $('#weixinGallery').on 'mouseout', '.img-item', ()->
      $(this).find('.img-controls').hide()

    upload
      button: 'weixinEditorImgUpload',
      multi: true,
      done: (uploads)->
        $.post('/api/v1/medias', {uploads: uploads}).then ()->
          self.images.unshift(upload) for upload in uploads

module.exports = Gallery