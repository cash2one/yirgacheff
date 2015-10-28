/**
 * Created by Frank on 15/4/13.
 */

'use strict';

var express = require('express');
var auth = require('../../middlewares/web.auth');
var qn = require('../../middlewares/qn');
var teachers = require('../../controllers/teachers.controller');

module.exports = function (app) {

    var teacher = express.Router();

    //教师角色相关路由
    teacher.get('/', teachers.index);  // 首页
    teacher.get('/profile', qn.imageToken, teachers.profile);//
    teacher.get('/classes', teachers.classManager); // 班级管理
    teacher.get('/students', teachers.studentManager);
    teacher.get('/classes/:classId([a-f0-9]{24})/students', teachers.studentManager);  // 学生管理

    teacher.get('/homework', teachers.homeworkManager); // 作业列表
    teacher.get('/homework/create', qn.audioToken, qn.imageToken, teachers.homeworkCreate); // 作业创建
    teacher.get('/homework/history', teachers.homeworkHistory); // 作业历史列表
    teacher.get('/homework/:homeworkId([a-f0-9]{24})', teachers.homeworkClassDetail); //班级作业详情
    teacher.get('/homework/:homeworkId([a-f0-9]{24})/students/:studentId([a-f0-9]{24})', teachers.homeworkStudentDetail);  // 学生作业详情
    teacher.get('/homework/:homeworkId([a-f0-9]{24})/history', teachers.homeworkHistoryClassDetail); // 班级作业历史详情
    teacher.get('/homework/:homeworkId([a-f0-9]{24})/students/:studentId([a-f0-9]{24})/history', teachers.homeworkHistoryStudentDetail); //学生作业历史详情


    teacher.get('/quizzes', teachers.quizManager);
    teacher.get('/quizzes/create', qn.imageToken, teachers.quizCreate);
    teacher.get('/quizzes/:quizId([a-f0-9]{24})', teachers.quizDetail);


    teacher.get('/connections', teachers.connectionPipe); // 家校通
    teacher.get('/connections/:studentId([a-f0-9]{24})', teachers.connectionPipeDetail); // 家校通详情
    teacher.get('/schedules', teachers.listSchedulers);

    teacher.get('/question', teachers.question); //在线答疑
    teacher.get('/question/questionInfo/:questionId([a-f0-9]{24})', teachers.questioninfo);

    teacher.get('/guider', teachers.audioGuider);//录音说明

    app.use('/teacher', auth.requiresLogin, auth.requireTeacherRole, teacher);

};
