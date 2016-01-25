Vue = require 'vue'

template = """
      <ul class="list-unstyled">
          <li class="item">
              <section class="360weixin">
                  <p><img style="width:100%;" src="http://resource.hizuoye.com/wx-images/share/share1.jpg"></p>
              </section>
          </li>
          <li class="item">
              <section class="360weixin">
                  <p><img style="width:100%;" src="http://resource.hizuoye.com/wx-images/share/share2.jpg"></p>
              </section>
          </li>
          <li class="item">
              <section class="360weixin">
                  <p><img style="width:100%;" src="http://resource.hizuoye.com/wx-images/share/share3.png"></p>
              </section>
          </li>
          <li class="item">
              <section class="360weixin">
                  <p><img style="width:100%;" src="http://resource.hizuoye.com/wx-images/share/share4.jpg"></p>
              </section>
          </li>
          <li class="item">
              <section class="360weixin">
                  <p><img style="width:100%;" src="http://resource.hizuoye.com/wx-images/share/share5.jpg"></p>
              </section>
          </li>
          <li class="item">
              <section class="360weixin">
                  <p><img style="width:100%;" src="http://resource.hizuoye.com/wx-images/share/share6.jpg"></p>
              </section>
          </li>
          <li class="item">
              <section class="360weixin">
                  <p><img style="width:80px;" src="http://resource.hizuoye.com/wx-images/share/share7.gif"></p>
              </section>
          </li>
          <li class="item">
              <section class="360weixin">
                  <p><img style="width:100%;" src="http://resource.hizuoye.com/wx-images/share/share8.jpg"></p>
              </section>
          </li>
          <li class="item">
              <section class="360weixin">
                  <p><img style="width:100%;" src="http://resource.hizuoye.com/wx-images/share/share9.gif"></p>
              </section>
          </li>
          <li class="item">
              <section class="360weixin">
                  <p><img style="width:100%;" src="http://resource.hizuoye.com/wx-images/share/share10.jpg"></p>
              </section>
          </li>
          <li class="item">
              <section class="360weixin">
                  <p><img style="width:100%;" src="http://resource.hizuoye.com/wx-images/share/share11.jpg"></p>
              </section>
          </li>
          <li class="item">
              <section class="360weixin">
                  <p><img style="width:100%;" src="http://resource.hizuoye.com/wx-images/share/share12.gif"></p>
              </section>
          </li>
          <li class="item">
              <section class="360weixin">
                  <p><img style="width:100%;" src="http://resource.hizuoye.com/wx-images/share/share13.gif"></p>
              </section>
          </li>
          <li class="item">
              <section class="360weixin">
                  <p><img style="width:100%;" src="http://resource.hizuoye.com/wx-images/share/share14.gif"></p>
              </section>
          </li>
          <li class="item">
              <section class="360weixin">
                  <p><img style="width:100%;" src="http://resource.hizuoye.com/wx-images/share/share15.jpg"></p>
              </section>
          </li>
          <li class="item">
              <section class="360weixin">
                  <p><img style="width:100%;" src="http://resource.hizuoye.com/wx-images/share/share16.gif"></p>
              </section>
          </li>
          <li class="item">
              <section class="360weixin">
                  <p><img style="width:100%;" src="http://resource.hizuoye.com/wx-images/share/share17.gif"></p>
              </section>
          </li>
      </ul>
"""
module.exports = Vue.extend
  template: template
  mixins: [require './ElementMixn']