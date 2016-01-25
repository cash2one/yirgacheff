Vue = require 'vue'

template = """
       <ul class="list-unstyled" >
        <li class="item">
            <section class="360weixin">
                <section style="max-width: 100%; font-family: sans-serif; white-space: normal; border: none; margin: 1em auto; text-align: center; width: 20em; box-sizing: border-box !important; word-wrap: break-word !important;"><section style="box-sizing: border-box !important; max-width: 100%; word-wrap: break-word !important; width: 20em; height: auto;"><img src="http://resource.hizuoye.com/wx-images/festival/festival1.png" alt="" style="width: 12em; box-sizing: border-box !important; word-wrap: break-word !important;"><section class="wxqq-bg" style="box-sizing: border-box !important; max-width: 100%; word-wrap: break-word !important; width: 19.8em; height: auto; background-color: rgb(214, 17, 17); border: 0.1em solid rgb(255, 255, 255); margin-top: -3.6em; border-top-left-radius: 0.33em; border-top-right-radius: 0.33em; border-bottom-right-radius: 0.33em; border-bottom-left-radius: 0.33em; overflow: hidden;"><section style="box-sizing: border-box !important; max-width: 100%; word-wrap: break-word !important; width: 9em; height: auto; display: inline-block; text-align: left; color: rgb(255, 255, 255); margin-top: 3em; overflow: hidden;"><p style="margin-top: 0px; margin-bottom: 0px; max-width: 100%; font-size: 1.1em; line-height: 1.2em; padding-bottom: 0.1em; box-sizing: border-box !important; word-wrap: break-word !important;">360家校云</p><p style="margin-top: 0px; margin-bottom: 0px; max-width: 100%; font-size: 0.95em; line-height: 1em; padding-bottom: 0.8em; box-sizing: border-box !important; word-wrap: break-word !important;">weixin </p><p style="margin-top: 0px; margin-bottom: 0px; max-width: 100%; font-size: 1em; line-height: 1.4em; box-sizing: border-box !important; word-wrap: break-word !important;">360家校云微信公众 weixin公众号</p></section><section style="box-sizing: border-box !important; max-width: 100%; word-wrap: break-word !important; width: 6.5em; height: auto; float: right; color: rgb(255, 255, 255); margin-top: 3em; margin-right: 1.5em; margin-bottom: 1em;"><img src="http://resource.hizuoye.com/wx-images/festival/festival2.jpg" alt="" style="width: 96px; box-sizing: border-box !important; word-wrap: break-word !important; height: 96px;" width="96" height="96" border="0" vspace="0" title=""><p style="margin-top: 0.2em; margin-bottom: 0px; max-width: 100%; font-size: 0.75em; box-sizing: border-box !important; word-wrap: break-word !important;">长按识别关注我们</p></section></section></section></section>
            </section>
        </li>
        <li class="item">
            <section class="360weixin">
                <section style="border: none; margin: 1em auto; text-align: center; width: 20em;"><section style="width:20em;"><img src="http://resource.hizuoye.com/wx-images/festival/festival8.png" alt="undefined" style="width:15em;" title="undefined"><img src="http://resource.hizuoye.com/wx-images/festival/festival9.png" alt="undefined" style="width:4em;margin-left:-2.4em;" title="undefined"></section><section class="wxqq-bg" style="width:20em;padding:1em 0;background-color:#d61111;margin-top:-0.8em;color:#fff;border-radius:5px;font-size:1em;"><p style="margin-top: 0px; margin-bottom: 0px;"><span style="font-family: 微软雅黑, 'Microsoft YaHei';">新年新气象</span></p></section></section>
            </section>
        </li>
        <li class="item">
            <section class="360weixin">
                <section style="border: none; margin: 1em auto; text-align: center; width: 20em;"><section style="width:5em;height:5em;margin:0 auto;"><img src="http://resource.hizuoye.com/wx-images/festival/festival10.png" alt="undefined" style="width:5em;" title="undefined"></section> <section style="margin-top: -2.5em;"><section class="wxqq-bg" style="color: rgb(255, 255, 255); background-color: rgb(214, 17, 17); display: inline-block; box-sizing: border-box; overflow: hidden; padding: 0.5em 1em; border-top-left-radius: 0.25em; border-top-right-radius: 0.25em; border-bottom-right-radius: 0.25em; border-bottom-left-radius: 0.25em; font-size: 2em; font-weight: 600; max-width: 18em !important;"><p style="margin-top: 0px; margin-bottom: 0px;"><span style="font-family: 微软雅黑, 'Microsoft YaHei';">01</span> </p></section></section></section>
            </section>
        </li>
        <li class="item">
            <section class="360weixin">
                <section style="border: 0px none; padding: 0px;"><section style="margin:0; padding:0; width:100%; display: inline-block"><section style="border-style:none;margin:0;padding-bottom:0;text-align:center;text-decoration:inherit"><img src="http://resource.hizuoye.com/wx-images/festival/festival8.png" style="color:inherit;margin-right:10px;vertical-align:middle;height:40px!important" title="undefined" alt="undefined"></section><section class="wxqq-bg" style="margin: -10px 10px 0px; padding: 10px 5px 5px; text-indent: 2em; background-color: rgb(255, 0, 0); color: rgb(255, 255, 255); line-height: 1.5em; border-top-left-radius: 10px; border-top-right-radius: 10px; border-bottom-right-radius: 10px; border-bottom-left-radius: 10px; background-position: initial initial; background-repeat: initial initial;"> <p style=" color:inherit"><span style="font-family: 微软雅黑, 'Microsoft YaHei';">中国古代曾以腊月、十月等的月首为元旦，汉武帝起为农历1月1日，中华民国起为公历1月1日，1949年中华人民共和国亦以公历1月1日为元旦。</span></p></section></section></section>
            </section>
        </li>
        <li class="item">
            <section class="360weixin">
                <section style="position: static; box-sizing: border-box; border: 0px none; padding: 0px; margin: 0px;"><section style="display: inline-block; vertical-align: top; width: 95%; margin-left: 1em; box-sizing: border-box; padding: 0px;" data-width="95%"><section style="border-left-width: 1px; border-left-style: solid; border-color: rgb(245, 245, 244); height: 1.2em; box-sizing: border-box; padding: 0px; margin: 0px;"></section><section style="border-top-left-radius: 100%; border-top-right-radius: 100%; border-bottom-right-radius: 100%; border-bottom-left-radius: 100%; margin-left: -1.8em; display: inline-block; width: 3em; height: 3em; box-sizing: border-box; padding: 0px;"><img style="height: 100%; vertical-align: middle; border-radius: 50%; width: 100%; margin: 0px;" src="http://resource.hizuoye.com/wx-images/festival/festival3.png" width="100%" height="100%" border="0" opacity="" title="" alt="" data-width="100%"></section><section style="border-left-width: 1px; border-left-style: solid; border-color: rgb(245, 245, 244); margin-top: -2.5em; padding-bottom: 0.5em; box-sizing: border-box;"><section style="padding-left: 25px; box-sizing: border-box; margin: 0px;"><section style="position: static; box-sizing: border-box; padding: 0px; margin: 0px;"><section style="padding-bottom: 8px; text-align: right; box-sizing: border-box; margin: 0px;"><section style="text-align: left; box-sizing: border-box; padding: 0px; margin: 0px;"><span style="color: #7B7B6F; font-size: 18px;" class="96wxDiy" data-brushtype="text">元旦到，问个好</span></section></section></section><section class="96wxDiy" style="box-sizing: border-box; padding: 0px; margin: 0px;"><p style="white-space: normal;"><span style="font-size: 14px;"></span><span style="font-size: 14px; color: #3F3F3F;">愿你开心困难少；青春驻，不变老，全家天天呵呵笑；儿女孝，幸福绕，忧愁全部上云霄；健康在，收入高，幸福生活乐逍遥。</span></p> </section></section></section></section></section>
            </section>
        </li>
        <li class="item">
            <section class="360weixin">
                <section style="position:static;box-sizing: border-box;"><p style="text-align: center; white-space: normal;"> <img src="http://resource.hizuoye.com/wx-images/festival/festival4.png" title="undefined" alt="undefined"></p><section style="margin-top:-4.5em;text-align:center;"><span style="font-size: 36px; color: #C00000;" class="96wxDiy" data-brushtype="text">元旦快乐</span> </section></section>
            </section>
        </li>
        <li class="item">
            <section class="360weixin">
                <section style="border: 0px none; padding: 0px;"><section style="position:static;box-sizing: border-box;text-align: center;"><p style=" color:inherit"><img src="http://resource.hizuoye.com/wx-images/festival/festival5.jpg" style="width:15em;"></p><section style="margin-top:-3.2em; margin-bottom:30px;"><span style="font-size: 24px; color:rgb(192,0,0);">元旦快乐</span></section></section></section>
            </section>
        </li>
        <li class="item">
            <section class="360weixin">
                <section style="margin: 5px auto;white-space: normal;max-width: 100%;"><section style="border-style:none;border:none #000;text-align:center;text-decoration:inherit"><img src="http://resource.hizuoye.com/wx-images/festival/festival6.png" style="color: inherit; margin-right: 10px; vertical-align: middle; width: 47px; height: 100px !important;" width="47" height="100" border="0" vspace="0" title="" alt=""><section style="border-left-width:2px;border-left-style:solid;border-color:#DD340A;padding-left:1em;text-align:left;display:inline-block;height:3em;vertical-align:top;color:#000;margin-top:2em"><section style="height:50%;margin-top:.3em;border-color:#000;color:inherit;font-size:24px"><span style="color: rgb(255, 0, 0);">新年快乐！</span></section></section></section></section>
            </section>
        </li>
        <li class="item">
            <section class="360weixin">
                <section style="margin: 5px auto;white-space: normal;max-width: 100%;">
                    <section style="border-style:none;border:none #000;text-align:center;text-decoration:inherit">
                        <img src="http://resource.hizuoye.com/wx-images/festival/festival7.png" style="color: inherit; margin-right: 10px; vertical-align: middle; width: 47px; height: 100px !important;" width="47" height="100" border="0" vspace="0" title="" alt="">
                        <section style="border-left-width:2px;border-left-style:solid;border-color:#DD340A;padding-left:1em;text-align:left;display:inline-block;height:3em;vertical-align:top;color:#000;margin-top:2em">
                            <section style="height:50%;margin-top:.3em;border-color:#000;color:inherit;font-size:24px">
                                <span style="color: rgb(255, 0, 0);"><span style="color: rgb(255, 0, 0); font-family: 微软雅黑, 'Microsoft YaHei'; font-size: 24px;">相约2016！</span></span>
                            </section>
                        </section>
                    </section>
                </section>
            </section>
        </li>
        <li class="item">
            <section class="360weixin">
                <section style="position: static; box-sizing: border-box; border: 0px none; padding: 0px; margin: 0px;"><section class="wxqq-bg" style="margin: 5px auto; padding: 10px 0px; width: 66%; box-sizing: border-box; background-color: rgb(198, 57, 48);" data-width="66%"><section style="border-top-width: 3px; border-top-style: solid; border-top-color: rgb(255, 208, 132); border-bottom-width: 3px; border-bottom-style: solid; border-bottom-color: rgb(255, 208, 132); padding: 8px; box-sizing: border-box; margin: 0px;" data-bcless="spin" data-bglessp="120"><section style="line-height: 0em; height: 35px !important; box-sizing: border-box; padding: 0px; margin: 0px;"><p style="white-space: normal;"><img src="http://resource.hizuoye.com/wx-images/festival/festival11.png" style="float:left;"><img src="http://resource.hizuoye.com/wx-images/festival/festival11.png" style="float: right;"></p></section><section style="margin-top: -38px; text-align: center; box-sizing: border-box; padding: 0px;"><span style="font-size: 28px; color:#FFD084;" class="96wxDiy" data-brushtype="text">新年快乐</span></section></section></section></section>
            </section>
        </li>
        <li class="item">
            <section class="360weixin">
                <p style="margin-top: 0px; margin-bottom: 0px; padding: 0px; border: 0px; color: rgb(68, 68, 68); font-family: 微软雅黑; font-size: 13px; line-height: 24px; white-space: normal;">
                    <br style="margin: 0px; padding: 0px; border: 0px;">
                </p>
                <section style="margin: 0px; padding: 0px; border: 0px; font-family: 微软雅黑; white-space: normal; box-sizing: border-box; color: rgb(44, 62, 80); font-size: 15px; line-height: 21px; background-color: rgb(254, 254, 254);">
                    <hr class="wxqq-bg borderTopColor" style="margin: 0px; padding: 0px; border-top-style: solid; background-color: rgb(165, 0, 3); box-sizing: content-box; height: 2px;">
                    <section style="margin: -18px 0px 0px; padding: 0px; border: 0px; box-sizing: border-box; text-align: center;">
                        <p class="wxqq-bg" style="margin: 0px 5px; padding: 0px; border: 0px; box-sizing: border-box; line-height: 36px; color: rgb(255, 255, 255); background-color: rgb(165, 0, 3); display: inline-block; width: 36px; height: 36px; border-top-left-radius: 18px; border-top-right-radius: 18px; border-bottom-right-radius: 18px; border-bottom-left-radius: 18px;">
                            新
                        </p>&nbsp;
                        <p class="wxqq-bg" style="margin: 0px 5px; padding: 0px; border: 0px; box-sizing: border-box; line-height: 36px; color: rgb(255, 255, 255); background-color: rgb(165, 0, 3); display: inline-block; width: 36px; height: 36px; border-top-left-radius: 18px; border-top-right-radius: 18px; border-bottom-right-radius: 18px; border-bottom-left-radius: 18px;">
                            春
                        </p>&nbsp;
                        <p class="wxqq-bg" style="margin: 0px 5px; padding: 0px; border: 0px; box-sizing: border-box; line-height: 36px; color: rgb(255, 255, 255); background-color: rgb(165, 0, 3); display: inline-block; width: 36px; height: 36px; border-top-left-radius: 18px; border-top-right-radius: 18px; border-bottom-right-radius: 18px; border-bottom-left-radius: 18px;">
                            快
                        </p>&nbsp;
                        <p class="wxqq-bg" style="margin: 0px 5px; padding: 0px; border: 0px; box-sizing: border-box; line-height: 36px; color: rgb(255, 255, 255); background-color: rgb(165, 0, 3); display: inline-block; width: 36px; height: 36px; border-top-left-radius: 18px; border-top-right-radius: 18px; border-bottom-right-radius: 18px; border-bottom-left-radius: 18px;">
                            乐
                        </p>
                    </section>
                </section>
            </section>
        </li>
        <li class="item">
            <section class="360weixin">
                <section class="wxqq-borderColor" style="margin: 0px; padding: 5px; border: 5px solid rgb(165, 0, 3); color: rgb(68, 68, 68); font-family: 微软雅黑; font-size: 13px; line-height: 24px; white-space: normal; box-sizing: border-box;"><section class="wxqq-borderColor" style="margin: 0px; padding: 15px 20px; border: 1px solid rgb(165, 0, 3); box-sizing: border-box;"><p class="wxqq-borderBottomColor" style="margin-top: 0px; margin-bottom: 10.5px; padding: 0px; border-width: 0px 0px 1px; border-bottom-style: solid; border-bottom-color: rgb(165, 0, 3); box-sizing: border-box; line-height: 1.4; color: rgb(165, 0, 3); text-align: center;"><span class="wxqq-color" style="margin: 0px; padding: 0px; border: 0px; box-sizing: border-box; font-size: 48px;"><strong style="margin: 0px; padding: 0px; border: 0px; box-sizing: border-box;">猴年大吉</strong></span></p><p style="margin-top: 0px; margin-bottom: 10.5px; padding: 0px; border: 0px; box-sizing: border-box; line-height: 1.4; color: rgb(165, 0, 3); text-align: center;"><span style="margin: 0px; padding: 0px; border: 0px; box-sizing: border-box; font-size: 18px;"><strong class="wxqq-color" style="margin: 0px; padding: 0px; border: 0px; box-sizing: border-box;">HAPPY 2016'S NEW YEAR</strong></span></p></section></section>
            </section>
        </li>
        <li class="item">
            <section class="360weixin">
                <section class="wxqq-borderColor" style="margin: 0px; padding: 10px 0px 0px 20px; border-width: 1px 1px 1px 60px; border-style: solid; border-color: rgb(131, 20, 31); font-family: 微软雅黑; font-size: 13px; line-height: 24px; white-space: normal; box-sizing: border-box; color: rgb(164, 0, 0);">
                    <section class="wxqq-color wxqq-borderBottomColor" style="margin: 0px; padding: 0px; border-width: 0px 0px 2px; border-bottom-style: solid; border-bottom-color: rgb(164, 0, 0); box-sizing: border-box; clear: both; float: left; color: rgb(131, 20, 31);">
                        <section style="margin: 0px; padding: 0px; border: 0px; box-sizing: border-box; font-size: 24px; font-weight: 700; float: left;">
                            New /<br style="margin: 0px; padding: 0px; border: 0px; box-sizing: border-box;">Spring
                        </section>
                        <section style="margin: 5px 0px 0px 45px; padding: 0px; border: 0px; box-sizing: border-box; font-size: 20px; font-weight: 700; float: left;">
                            春.<br style="margin: 0px; padding: 0px; border: 0px; box-sizing: border-box;">新年快乐2016
                        </section>
                    </section>
                    <p class="wxqq-borderBottomColor" style="margin-top: 0px; margin-bottom: 10.5px; padding: 0px; border-width: 0px; border-bottom-color: rgb(131, 20, 31); box-sizing: border-box; line-height: 1.4; clear: both;">
                        <br>
                    </p>
                    <p class="wxqq-color wxqq-borderBottomColor" style="margin-top: 0px; margin-bottom: 10.5px; padding: 0px; border: 0px; box-sizing: border-box; line-height: 1.4; color: rgb(131, 20, 31);">
                        &nbsp; &nbsp; HAPPY NEW YEAR&nbsp;<em style="margin: 0px; padding: 0px; border: 0px; box-sizing: border-box;">!!!</em>
                    </p>
                    <p>
                        <em style="margin: 0px; padding: 0px; border: 0px; box-sizing: border-box;"><br></em>
                    </p>
                </section>
            </section>
        </li>
    </ul>
"""

module.exports = Vue.extend
  template: template
  mixins: [require './ElementMixn']
