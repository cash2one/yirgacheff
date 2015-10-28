/**
 * Created by Frank on 2015/10/19.
 */

'use strict';

var question = require('../../api/v1/question.api');

module.exports = function(api){
    //问题相关api
    api.route('/question')
        .get(question.list)         //获取当前学校的学生问题
        .post(question.solve)
}