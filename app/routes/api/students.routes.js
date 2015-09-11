/**
 * Created by Frank on 15/4/13.
 */

'use strict';

var students = require('../../api/v1/students.api'),
    qrcodeApi = require('../../api/v1/qrcode.api'),
    qrcodeMid = require('../../middlewares/qrcode');

module.exports = function (api) {

    api.get('/students', students.list);
    api.route('/students/:studentId([a-f0-9]{24})')
        .get(students.read)   // 读取指定学生信息
        .put(students.update) // 修改学生信息
        .delete(students.deleteById); //删除学生信息

    api.put('/students/:studentId([a-f0-9]{24})/score', students.scoreAward);

    api.route('/classes/:classId([a-f0-9]{24})/students')
        .get(students.getByClass)   //根据班级获取学生信息
        .post(students.create);     //在指定班级下创建学生

    api.get('/classes/:classId([a-f0-9]{24})/students/qrcode', qrcodeMid.getQrcode, qrcodeMid.generateQrcode, qrcodeApi.downloadStudentList);

    api.route('/noneClass/students').
        get(students.getNoneClassStudents); // 获取没有任何班级的学生列表
    api.route('/classes/:classId([a-f0-9]{24})/students').put(students.joinAClass);
    api.route('/classes/:classId([a-f0-9]{24})/students/:studentId([a-f0-9]{24})')
        .put(students.joinAClass)  // 将指定学生加入指定班级
        .delete(students.quitAClass); // 将指定学生退出指定班级

    api.get('/teachers/:teacherId([a-f0-9]{24})/students', students.getByTeacher);


};
