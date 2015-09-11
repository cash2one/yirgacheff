/**
 * Created by Frank on 15/4/13.
 */

'use strict';

var teachers = require('../../api/v1/teachers.api');

module.exports = function (api) {
// 教师相关API
    api.route('/teachers')
        .get(teachers.list)   //获取当前用户学校的教师列表
        .post(teachers.create);  // 在当前用户学校创建教师

    api.get('/teachers/disabled', teachers.listDisabled); //获取禁用老师列表

    api.put('/teachers/:teacherId([a-f0-9]{24})/enable', teachers.enable);

    api.route('/teachers/:teacherId([a-f0-9]{24})')
        .get(teachers.read)
        .put(teachers.update)
        .delete(teachers.disable);


};
