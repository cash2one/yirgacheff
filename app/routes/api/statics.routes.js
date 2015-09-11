/**
 * Created by Frank on 15/4/13.
 */
'use strict';

var statics = require('../../api/v1/statistics.api');

module.exports = function (api) {

    // 统计所有学生数量
    api.get('/statics/students/count', statics.studentCount);

    // 统计指定教师学生数量
    api.get('/statics/teachers/:teacherId([a-f0-9]{24})/students/count', statics.studentCountByTeacher);

    // 统计教师数量
    api.get('/statics/teachers/count', statics.teacherCount);

    // 统计所有班级数量
    api.get('/statics/classes/count', statics.classCount);


    // 统计指定教师班级数量
    api.get('/statics/teachers/:teacherId([a-f0-9]{24})/classes/count', statics.classCount);


    // 统计当前学校家庭作业数量
    api.get('/statics/homework/count', statics.homeworkCount);
    // 作业错误分布
    api.get('/statics/homework/:homeworkId([a-f0-9]{24})/wrongCount', statics.wrongCount);

    // 统计指定教师家庭作业数量
    api.get('/statics/teachers/:teacherId([a-f0-9]{24})/homework/count', statics.homeworkCount);

    api.get('/statics/teachers/quizContributionRank', statics.quizContributionRank);

    api.get('/statics/teachers/studentsCountOfTaughtRank', statics.studentsCountOfTaughtRank);

    // 入学人数统计
    api.get('/statics/students/enrolStudentsCount', statics.studentsEnrol);


    // 学生积分分布统计
    api.get('/statics/students/scoreDistribution', statics.scoreDistribution);

};
