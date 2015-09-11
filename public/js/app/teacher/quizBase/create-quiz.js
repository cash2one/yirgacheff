'use strict';

requirejs(['jquery', 'restfulClient', 'leftMenu', 'headMenu', 'exerciseBuilder', 'layerWrapper', 'easyDropDown'],
    function ($, $http, leftMenu, headMenu, exerciseBuilder, layer) {
        leftMenu.init();
        headMenu.init();

        //新建题目
        $('#add-quiz').bind('click', addQuiz);
        $('.continue-create-homework').click(addQuiz);

        function addQuiz() {
            layer.open('quiz-type-box', function (index) {
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
            }, closeAddDialogAction);
        }

        function closeAddDialogAction() {
            $('#tab-title').find('li').eq(0).addClass('active').siblings().removeClass('active');
            $('.w-quiz-type-container').eq(0).show().siblings().hide();

        }

        //tab页面切换
        $('#tab-title').find('li').each(function (index) {
            $(this).bind('click', function () {
                var $selectContainer = $('.w-quiz-type-container').eq(index);
                if (!$(this).hasClass('active')) {
                    $(this).addClass('active').siblings().removeClass('active');
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
            var title = $('#homework-title').val();
            if (title === '') {
                layer.msg('请填写套题标题！');
                return false;
            }
            return {title: title};
        }

        //获取作业信息
        function gtHomeworkData() {
            var assignInfo = getAssignInfo();
            //作业信息校验
            if (!assignInfo) {
                return;
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
            assignInfo.addQuizBase = true;
            return assignInfo;
        }

        //保存作业
        $('#save-homework').on('click', function () {
            var data = gtHomeworkData();
            if (!data) return false;
            $http.post('/api/v1/quizzes', data, function () {
                location.href = '/teacher/quizzes';
            });
        });
    });
