define(['jquery', 'underscore', 'layerWrapper', 'jqueryForm'], function ($, _, layer) {

    var templates = {};

    function buildUpTextSel(optionCount, exercise) {
        exercise = exercise || {};
        var template = templates.textSelectTemplate;
        if (!template) {
            template = _.template($("#textSelectTemplate").html());
            templates.textSelectTemplate = template;
        }
        return template({optionCount: optionCount, exercise: exercise});
    }

    //图片选择题[出题]
    function buildUpImageSel(optionCount, exercise) {
        var token = $('#imageToken').val();
        var schoolId = GLOBAL.user.schoolId;
        exercise = exercise || {};
        var template = templates.imageSelectTemplate;
        if (!template) {
            template = _.template($("#imageSelectTemplate").html());
            templates.imageSelectTemplate = template;
        }
        return template({optionCount: optionCount, exercise: exercise, token: token, schoolId: schoolId.toString()});
    }


    //填空[出题]
    function buildUpFillBlanks(exercise) {
        exercise = exercise || {};
        var template = templates.blankTemplate;
        if (!template) {
            template = _.template($("#blankTemplate").html());
            templates.blankTemplate = template;
        }
        return template({exercise: exercise});
    }

    // 语音题出题
    function buildVoiceQuestions(exercise) {
        exercise = exercise || {};
        var template = templates.voiceTemplate;
        if (!template) {
            template = _.template($("#voiceTemplate").html());
            templates.voiceTemplate = template;
        }
        return template({exercise: exercise});
    }

    function bindImageUploadEvent() {
        $('.imageFile').change(function () {
            var $img = $(this).closest('li').find('img');
            $(this).parent().ajaxSubmit({
                beforeSubmit: function () {
                    layer.load();
                },
                statusCode: {
                    403: function () {
                        layer.msg('请上传图片格式文件');
                    },
                    413: function () {
                        layer.msg('图片不能超过200KB');
                    }
                },
                success: function (res) {
                    $img.attr('src', 'http://resource.hizuoye.com/' + res.key + '?imageView2/1/w/100/h/100/interlace/1');
                    $img.attr('id', res.key);
                    layer.closeAll();
                }
            });
        });
    }

    function makeFillBlanksObj($selectLi) {
        var obj = {};
        //组装Obj
        obj.question = $selectLi.find('.question').val().trim();
        obj.answer = $selectLi.find('.answer').val().trim();
        obj.analysis = $selectLi.find('.analysis').val().trim();
        obj.sequence = $selectLi.find('.seq-val').text().trim();
        obj.description = $selectLi.find('.description').val().trim();
        return obj;
    }

    function makeVoiceSelObj($selectLi) {
        //生成预览数据
        var obj = {};
        obj.question = $selectLi.find('.question').val();
        obj.sequence = $selectLi.find('.seq-val').text();
        return obj;
    }

    function makeTextSelObj($selectLi) {
        var obj = {};
        //选项数组
        var _choices = [];
        $selectLi.find('div.option-whole').each(function (_index_) {
            _choices[_index_] = {
                title: $(this).find('div.option-info').attr('title'),
                content: $(this).find('input.option-input').val()
            };
        });
        //组装Obj
        obj.question = $selectLi.find('.question').val().trim();
        obj.answer = $selectLi.find('.answer').val().trim();
        obj.analysis = $selectLi.find('.analysis').val().trim();
        obj.sequence = $selectLi.find('.seq-val').text().trim();
        obj.choices = _choices;
        return obj;
    }

    function makeImageSelObj($selectLi) {
        var obj = {};
        var _choices = [];
        $selectLi.find('ul.option-whole li').each(function (index) {
            var img = $(this).find('img');
            var preview = img.attr('src'),
                key = img.attr('id');
            _choices[index] = {
                title: $(this).find('.label-title').text(),
                content: key,
                preview: preview
            };
        });
        obj.question = $selectLi.find('.question').val().trim();
        obj.answer = $selectLi.find('.answer').val().trim();
        obj.analysis = $selectLi.find('.analysis').val().trim();
        obj.sequence = $selectLi.find('.seq-val').text().trim();
        obj.choices = _choices;
        return obj;
    }

    var buildExercisesWithData = function (exercises) {
        exercises = exercises || [];
        var result = '';
        for (var i = 0; i < exercises.length; i++) {
            var exercise = exercises[i];
            var eType = parseInt(exercise.eType);
            switch (eType) {
                case 0:        //文字选择题
                    result += buildUpTextSel(exercise.choices.length, exercise);
                    break;
                case 1:        //图片选择题
                    result += buildUpImageSel(exercise.choices.length, exercise);
                    bindImageUploadEvent();
                    break;
                case 2:        //填空题
                    result += buildUpFillBlanks(exercise);
                    break;
                case 3:        //语音题
                    result += buildVoiceQuestions(exercise);
                    break;
            }
        }
        return result;
    };

    var buildExercises = function ($append, type, count, optionCount) {
        var result;
        var eType = parseInt(type);
        switch (eType) {
            case 0:        //文字选择题
                result = buildUpTextSel(optionCount);
                break;
            case 1:        //图片选择题
                result = buildUpImageSel(optionCount);
                break;
            case 2:        //填空题
                result = buildUpFillBlanks();
                break;
            case 3:        //语音题
                result = buildVoiceQuestions();
                break;
        }
        for (var i = 0; i < count; i++) {
            $append.append(result);
        }
        if (eType === 1) {
            bindImageUploadEvent();
        }
    };

    var makeExerciseObject = function ($selectLi) {
        var result;
        var type = $selectLi.find('input[name="current-type"]').val();
        var eType = parseInt(type);
        switch (eType) {
            case 0:        //文字选择题预览
                result = makeTextSelObj($selectLi);
                break;
            case 1:        //图片选择题预览
                result = makeImageSelObj($selectLi);
                break;
            case 2:        //填空题预览
                result = makeFillBlanksObj($selectLi);
                break;
            case 3:        //语音题暂时没有预览
                result = makeVoiceSelObj($selectLi);
                break;
        }
        if (result) {
            result.eType = eType;
        }
        return result;
    };

    var validateExerciseObject = function (obj) {
        var message = null,
            prefix = '';
        if (!obj) {
            message = '对象不能为空';
        }
        else if (!obj.sequence || obj.sequence === '') {
            message = '序号不能为空';
        }
        else {
            prefix = '第' + obj.sequence + '题';
            if (!obj.question || obj.question.trim() === '') {
                message = prefix + ' 题干不能为空';
            } else {
                var eType = obj.eType;
                if (eType === 0 || eType === 1) {
                    var choices = obj.choices,
                        count = choices.length;
                    for (var i = 0; i < count; i++) {
                        var choice = choices[i];
                        if (!choice.content || choice.content.trim() === '') {
                            message = prefix + '选项不全';
                            break;
                        }
                    }
                    if (message === null) {
                        if (!obj.answer || obj.answer.trim() === '') {
                            message = prefix + '答案不能为空';
                        }
                    }
                }
                else if (eType !== 3) {
                    if (!obj.answer || obj.answer.trim() === '') {
                        message = prefix + '答案不能为空';
                    }
                }
            }
        }
        return {
            valid: message === null,
            message: message
        }
    };

    return {
        buildExercises: buildExercises,
        makeExerciseObject: makeExerciseObject,
        buildExercisesWithData: buildExercisesWithData,
        validateExerciseObject: validateExerciseObject

    };
});

