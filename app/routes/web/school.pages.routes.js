/**
 * Created by Frank on 15/4/13.
 */
'use strict';
var express = require('express');
var auth = require('../../middlewares/web.auth');
var qrcode = require('../../middlewares/qrcode');
var schools = require('../../controllers/schools');

module.exports = function (app) {
    var school = express.Router();

    school.get('/', schools.core.index);  // 首页
    school.get('/profile', schools.core.profile);//个人中心
    school.get('/qrcode', qrcode.getQrcode, qrcode.generateQrcode, schools.core.qrcode);//二维码


    school.get('/teachers', schools.manager.teacherManager);
    school.get('/teachers/disabled', schools.manager.disabledTeacherManager);

    school.get('/classes', schools.manager.classesManager);
    school.get('/classes/:classId([a-f0-9]{24})', schools.manager.classDetail);

    school.get('/students', schools.manager.studentManager);
    school.get('/students/noneClass', schools.manager.studentManagerOfNoneClass);


    school.get('/students/:studentId([a-f0-9]{24})', schools.connections.connectionDetail);

    school.get('/quizzes', schools.quizBase.quizManager);
    school.get('/quizzes/:quizId([a-f0-9]{24})', schools.quizBase.quizDetail); // 题库题目详情


    school.get('/scores/mall', schools.score.scoreMall);//积分商城
    school.get('/scores/instruction', schools.score.scoreExplanation);//兑换说明

    //微网站
    school.get('/materials', schools.site.mediasManager);  //图片库
    school.get('/categories', schools.site.categoriesMiddleware(), schools.site.categoriesManager);        //栏目管理
    school.get('/posts', schools.site.categoriesMiddleware('name'), schools.site.listPosts);
    school.get('/posts/:postId([a-f0-9]{24})/', schools.site.categoriesMiddleware('name'), schools.site.updatePost);
    school.get('/posts/create', schools.site.categoriesMiddleware('name'), schools.site.createPost);  //内容发布
    school.post('/posts/create', schools.site.doCreatePost);
    school.post('/posts/:postId([a-f0-9]{24})/update', schools.site.doUpdatePost);


    //营销任务
    school.get('/tasks', schools.task.taskManager);
    school.get('/tasks/:taskId([a-f0-9]{24})', schools.task.viewTask);
    school.get('/tasks/create', schools.task.createTask);
    school.get('/tasks/posts/create', schools.task.createPostShare);
    school.post('/tasks/posts/create', schools.task.doCreatePostShare);
    school.get('/tasks/activities/create', schools.task.createActivityShare);
    school.post('/tasks/activities/create', schools.task.doCreateActivityTask);
    school.get('/tasks/lotteries/create', schools.task.createLotteryShare);


    school.get('/schedules', schools.schedule.listSchedulers);

    school.param('categoryId', schools.site.categoryById);
    school.param('postId', schools.site.postById);

    app.use('/school', auth.requiresLogin, auth.requireSchoolRole, school);


};
