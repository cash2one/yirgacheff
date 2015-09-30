'use strict';
requirejs(['jquery', 'restfulClient', 'leftMenu', 'headMenu', 'exerciseBuilder', 'layerWrapper', 'upload', 'validator', 'audiojs', 'easyDropDown'],
    function ($, $http, leftMenu, headMenu, exerciseBuilder, layer, upload, validator) {
        leftMenu.init();
        headMenu.init();
        var classes = $('#level_and_clazzs').find('ul li');
        if (classes.length === 0) {
            layer.confirm('没有班级，去添加新班级', function () {
                self.location = '/teacher/classes';
            });
            return false;
        }
        upload.audioUploader({
            onComplete: function (file, done) {
                var _audiojs = '<audio src="' + file.url +
                    '" preload="none"></audio>';
                $('#keypoint-recording-display').html(_audiojs);
                $('#keyPointRecord').val(file.key);
                enalbeAudiojs();
                done();
            }
        });

        //班级选择
        classes.bind('click', function () {
            var clazz = 'active';
            var mark = $(this).hasClass(clazz);
            if (mark) {
                $(this).removeClass(clazz);
            } else {
                $(this).addClass(clazz);
            }
        });

        var exercises = window.exercises;
        if (exercises) {
            $('#questions-area').html(exerciseBuilder.buildExercisesWithData(exercises));
            displayQuizNum();
        }
        //新建题目
        $('#add-quiz').bind('click', addHomework);

        $('.continue-create-homework').click(addHomework);

        function addHomework() {
            layer.open({
                closeBtn: false,
                contentId: 'quiz-type-box',
                okCallback: function (index) {
                    var $append = $('#questions-area'),
                        $current = $('div.w-quiz-type-container:visible'),
                        eType = $current.find('input[name = eType]').val(),
                        exerciseCount = $current.find('select[name = quiz-count]').val(),
                        $optionSelect = $current.find('select[name = quiz-options]'),
                        optionsCount;
                    if (exerciseCount == 0) {
                        layer.alert('请选择 [计划出多少道题]！');
                        return;
                    }
                    if ($optionSelect.val() == 0) {
                        layer.alert('请选择 [每道题几个选项]！');
                        return;
                    } else {
                        optionsCount = $optionSelect.val();
                    }
                    exerciseBuilder.buildExercises($append, eType, exerciseCount, optionsCount);
                    //显示当前一共有多少道题目
                    displayQuizNum();
                    closeAddDialogAction();
                    layer.close(index);
                },
                cancelCallback: function () {
                    closeAddDialogAction();
                }
            });
        };

        function closeAddDialogAction() {
            $('#tab-title').find('li').eq(0).addClass('active').siblings().removeClass('active');
            $('.w-quiz-type-container').eq(0).show().siblings().hide();
        }

        //tab页面切换
        $('#tab-title').find('li').each(function (index) {
            $(this).bind('click', function () {
                var $selectContainer = $('.w-quiz-type-container').eq(index);
                if (!$(this).hasClass('active')) {
                    $(this)
                        .addClass('active')
                        .siblings()
                        .removeClass('active');
                }
                if (!$selectContainer.is(":visible")) {
                    $selectContainer.show().siblings().hide();
                }
            });
        });
        $('.w-base-container').on('click', '.w-homework-quiz-close', function () {
            $(this).parent().parent().parent().remove();
            //更新题目总数的显示
            displayQuizNum();
        });

        //获取当前一共有多少道题目
        function getTotalNumber() {
            return $('#questions-area').find('li.buildUp').size();
        }

        //显示每道题的序号
        function displaySequence() {
            var $list = $('#questions-area').find('li.buildUp');
            $list.each(function (index) {
                var value = parseInt(index) + 1;
                $(this).find('.seq-val').text(value);
            });
        }


        //更新题目个数并显示出来
        function displayQuizNum() {
            var size = getTotalNumber();
            var $tip = $('.w-homework-tip');
            var $store = $('.w-homework-store');
            if (size == 0) {
                $tip.show();
                $store.hide();
            } else {
                $tip.hide();
                $store.show();
            }
            $('#total-number').text(size);
            //更新题号
            displaySequence();
        }

        //作业信息的校验
        function getAssignInfo() {
            var classes = $('.t-homeworkClass-list').find('ul>li.active');
            var title = $('#homework-title').val();
            var keyPoint = $('#keyPoint').val().trim();
            var keyPointRecord = $('#keyPointRecord').val();
            var finishAward = $('#finishAward').val();
            var performanceAward = $('#performanceAward').val();
            var addQuizBase = $('#addQuizBase').val();
            var classIds = [];
            classes.each(function () {
                classIds.push($(this).attr('id'));
            });
            var assignInfo = {
                title: title,
                keyPoint: keyPoint,
                classIds: classIds,
                finishAward: finishAward,
                performanceAward: performanceAward
            };
            if (addQuizBase === '1') {
                assignInfo.addQuizBase = true;
            }
            if (keyPointRecord && keyPointRecord !== "") {
                assignInfo.keyPointRecord = keyPointRecord;
            }
            return assignInfo;
        }

        //获取作业信息
        function gtHomeworkData() {
            var assignInfo = getAssignInfo();
            if (assignInfo.classIds.length === 0) {
                layer.msg('请选择要布置作业的班级！');
                return false;
            }
            if (assignInfo.title === '') {
                layer.msg('请填写作业标题！');
                return false;
            }
            if (!validator.isInt(assignInfo.finishAward, {min: 0, max: 9999})) {
                layer.msg('完成奖励分数必须为0-9999的数字');
                return false;
            }
            if (!validator.isInt(assignInfo.performanceAward, {min: 0, max: 9999})) {
                layer.msg('成绩奖励分数必须为0-9999的数字');
                return false;
            }
            var exercises = [];
            $('#questions-area')
                .find('li.buildUp')
                .each(function () {
                    exercises.push(exerciseBuilder.makeExerciseObject($(this)));
                });
            var message = null;
            for (var i = 0; i < exercises.length; i++) {
                var res = exerciseBuilder.validateExerciseObject(exercises[i]);
                if (!res.valid) {
                    message = res.message;
                    break;
                }
            }
            if (message) {
                layer.msg(message);
                return false;
            }
            assignInfo.exercises = exercises;
            return assignInfo;
        }

        //启用audiojs
        function enalbeAudiojs() {
            setTimeout(function () {
                audiojs.events.ready(function () {
                    audiojs.createAll();
                });
            }, 100);
        }

        //保存作业
        $('#save-homework').on('click', function () {
            var data = gtHomeworkData();
            if (!data) return false;
            $http.post('/api/v1/homework', data, function () {
                location.href = '/teacher/homework';
            });
        });
    });
