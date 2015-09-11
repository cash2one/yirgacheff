/**
 * Created by Frank on 15/4/13.
 */
'use strict';

var homework = require('../../api/v1/homework.api');

module.exports = function (api) {

    // 创建作业
    api.post('/homework', homework.create);

    // 关闭作业
    api.put('/homework/:homeworkId([a-f0-9]{24})/close', homework.close); //关闭作业

    // 删除作业
    api.delete('/homework/:homeworkId([a-f0-9]{24})', homework.del);


    api.put('/homework/:homeworkId([a-f0-9]{24})/students/:studentId([a-f0-9]{24})/award', homework.award);


};

