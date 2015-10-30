/**
 * Created by Frank on 15/4/13.
 */
'use strict';

var quizBase = require('../../api/v1/quizBase.api');

module.exports = function (api) {

    //创建练习
    api.post('/quizzes', quizBase.create);

    //删除练习
    api.delete('/quizzes/:quizId([a-f0-9]{24})', quizBase.remove);

    api.get('/quizzes',quizBase.list);

};

