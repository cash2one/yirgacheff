'use strict';

define(['jquery','layerWrapper'], function ($,layer) {
    var c = 0;
    var _Timer, started = false;
    var maxTime = '05:00';
    var displayMicrophonePanel = true;
    var _completeCallback = null,
        _layerIndex = null;

    function noneDisplayMicrophonePanel() {
        displayMicrophonePanel = false;
    }

    function start_recording() {
        if (displayMicrophonePanel) {
            $('#start-recording-page').hide();
            $('#flashobj-page').show(flashHeightAdjustmentAsc);
            document['recorderApp'].allowMicrophone();
        } else {
            authorizedMicphone();
        }
    }


    function authorizedMicphone() {
        $('#flashobj-page').hide(flashHeightAdjustmentDec);
        $('#recording-page').show();
    }

    function unAuthorizedMicphone() {
        //layer.alert('请点击[允许]使用麦克风！');
        //console.log('请点击[允许]使用麦克风');
        //closeCallback();
        //layer.closeAll();
        //layer.msg('请点击[允许]按钮，不然无法完成录音！');
    }

    function funBeginDisTime() {
        c = c + 1000;
        var now = new Date(0, 0, 0, 0, 0, 0, c);
        var minutes = now.getMinutes();
        var sec = now.getSeconds();
        var _minute = parseInt(minutes);
        var _second = parseInt(sec);
        var c_sec = '';
        if (_second < 10) {
            c_sec = '0' + _second;
        } else {
            c_sec = _second;
        }
        var c_min = '0' + _minute;
        var mention = c_min + ":" + c_sec;
        if (mention == maxTime) {
            maxTimeHandler();
        } else {
            $('.recording-duration').html(mention);
            _Timer = setTimeout("funBeginDisTime()", 1000);
        }
    }

    //到达最大时长处理
    function maxTimeHandler() {
        stopRecordingClick();
    }

    function funStopDisTime() {
        clearTimeout(_Timer);
    }

    function setStopperTrue() {
        started = true;
    }

    function setStopperFalse() {
        started = false;
    }

    function voiceRateFrequency(val) {
        val = val * 100;
        var right = 0, left = 0;
        if (val >= 100) {
            right = 100;
            left = 0;
        } else {
            right = val;
            left = 100 - val;
        }
        $('.phone-right').css('width', right + '%');
        $('.phone-left').css('width', left + '%');
    }

    function stopRecordingClick() {
        $('#recording-page').hide();
        $('#progress-page').show();
        $('#speak-sound-progress').css('width', '0%');
        document['recorderApp'].stopRecording('');
        funStopDisTime();
    }


    function progressbarHandler(percent) {
        $('.progressbar-per').css('width', percent + '%');
        $('.progressbar-num').html(percent + '%');
    }


    function playRecordingUI() {
        $('#progress-page').hide();
        $('#play-recording-page').show();
    }


    function playRecording() {
        $('.play-pause-btn').removeClass('play-icon')
            .addClass('pause-icon');

        $('#speak-sound-progress').css('width', '0%');
        var sts = $('.recording-duration').eq(0).text()
            .split(':');
        var tot = 0;
        if (sts.length == 2) {
            tot = parseInt(sts[0]) * 60 + parseInt(sts[1]);
        }

        if (tot != 0) {
            try {
                document['recorderApp'].playRecording();
                $('#speak-sound-progress').animate({
                    'width': '100%'
                }, tot * 1000, function () {
                    donePlaying();
                });
            } catch (error) {
                console.log(error);
            }

        }
    }

    function donePlaying() {
        $('.play-pause-btn').removeClass('pause-icon')
            .addClass('play-icon');
    }


    function resetRecording() {
        document['recorderApp'].stopRecording("reset");
        clearTimeout(_Timer);
        $('.recording-duration').html("00:00");
        _Timer = null;
        c = 0;
        //修改文字
        $('#restarted-recording').show();
        $('#stop-recording').hide();


    }

    function stopPlayingAudio(){
        document['recorderApp'].stopPlayingRecording();
    }

    function restartedRecorded() {
        $('#play-recording-page').hide();
        $('#recording-page').show();
        document['recorderApp'].stopRecording("reset");
        stopPlayingAudio();
        clearTimeout(_Timer);
        $('.recording-duration').html("00:00");
        _Timer = null;
        c = 0;
        $('#restarted-recording').show();
        $('#stop-recording').hide();
    }

    function restartedRecording() {
        $('#restarted-recording').hide();
        $('#stop-recording').show();
        document['recorderApp'].startRecording();//启动Timer
        //funBeginDisTime();
    }


    function save_complete(message) {
        if (message) {
            var result = $.parseJSON(message);
            //console.log('index:', _layerIndex);
            _completeCallback(result, _layerIndex);
        }
    }

    function save_failed(message) {
        if (message) {
            var result = $.parseJSON('{"message":"音频上传失败，请刷新页面重新录制！"}');
            _completeCallback(result, _layerIndex);
        }
    }

    function save_progress(bytesLoaded, bytesTotal) {
        //保存进行中
        //console.log(" progress: " + bytesLoaded + " / " + bytesTotal);
    }

    function successCallback(callback) {
        function _complete(index) {
            _completeCallback = callback;
            _layerIndex = index;
            layer.load(1,{});
            document.getElementById("recorderApp").style.width = '0';
            document.getElementById("recorderApp").style.height = '0';

            //schoolId
            var schoolId = $('#schoolId').val();
            var audioToken = $('#audioToken').val();
            document['recorderApp'].saveRecording(document.uploadForm.action, schoolId, audioToken);
        }

        return _complete;

    }

    function testMethod(msg) {
        console.log('---'+msg+'--');
    }

    function flashHeightAdjustmentDec(){
        $('#flashContainer').css({'margin-top':'100px'});
    }

    function flashHeightAdjustmentAsc(){
        $('#flashContainer').css({'margin-top':'0px'});
    }

    function denyMicrophoneMsg(){
        $('#start-recording-page').show();
        $('#flashobj-page').hide('fast',flashHeightAdjustmentDec);
        layer.msg('请点击 [允许] 按钮, 否则录音无法完成！');
    }

    function closeCallback() {
        if (started) {
            document['recorderApp'].stopRecording('');
        }
        clearTimeout(_Timer);
        $('.recording-duration').html("00:00");
        _Timer = null;
        c = 0;
        document.getElementById("recorderApp").style.width = '230px';
        document.getElementById("recorderApp").style.height = '150px';
        //console.log(displayMicrophonePanel + '-----');
        if(displayMicrophonePanel){
            $('#start-recording-page').show();
            $('#recording-page').hide();
        }else{
            $('#start-recording-page').hide();
            $('#recording-page').show();
        }
        $('#restarted-recording').show();
        $('#stop-recording').hide();
        $('#flashobj-page').hide(flashHeightAdjustmentDec);
        $('#play-recording-page').hide();
        $('.phone-right').css('width', '0%');
        $('.phone-left').css('width', '100%');
    }

    $('#start-recording').click(start_recording);
    $('#stop-recording').click(stopRecordingClick);
    $('.play-icon').click(playRecording);
    $('#reset-one').click(resetRecording);
    $('#sec-rec').click(restartedRecorded);
    $('#restarted-recording').click(restartedRecording);

    function setGlobalFunction(window) {
        window.noneDisplayMicrophonePanel = noneDisplayMicrophonePanel;
        window.authorizedMicphone = authorizedMicphone;
        window.funBeginDisTime = funBeginDisTime;
        window.maxTimeHandler = maxTimeHandler;
        window.funStopDisTime = funStopDisTime;
        window.setStopperTrue = setStopperTrue;
        window.setStopperFalse = setStopperFalse;
        window.voiceRateFrequency = voiceRateFrequency;
        window.progressbarHandler = progressbarHandler;
        window.playRecordingUI = playRecordingUI;
        window.resetRecording = resetRecording;
        window.save_progress = save_progress;
        window.save_complete = save_complete;
        window.save_failed = save_failed;
        window.unAuthorizedMicphone = unAuthorizedMicphone;
        window.denyMicrophoneMsg = denyMicrophoneMsg;
        window.stopPlayingAudio = stopPlayingAudio;
        window.testMethod = testMethod;
    }

    return {
        successCallback: successCallback,
        closeCallback: closeCallback,
        setGlobalFunction: setGlobalFunction
    }

});