/**
 * Created by Admin on 2016/1/30.
 */


import Vue from 'vue';
import app from  '../../../common/app';
import notify from '../../../common/notify';
import vEditor from '../../../components/Editor';
import vUpload from '../../../components/upload';
import vIcon from '../../../components/iconfont';

$(document).ready(function () {
    app();
    var $voteEnrollList =$("#voteEnrollList");

    $voteEnrollList.on('mouseover', '.img-box', function () {
        $(this).find('.img-setting').show()
    });
    
    $voteEnrollList.on('mouseout', '.img-box', function () {
        $(this).find('.img-setting').hide()
    });

});