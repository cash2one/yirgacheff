/**
 * Created by Admin on 2016/1/30.
 */
var app = require('../../../common/app');
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