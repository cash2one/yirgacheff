/**
 * Created by Frank on 15/4/13.
 */

'use strict';

var classes = require('../../api/v1/classes.api'),
    auth = require('../../middlewares/api.auth');

module.exports = function (api) {

    // 班级相关API
    api.route('/classes')
        .get(classes.listMyClasses)// 获取当前教师的班级列表
        .post(auth.requireTeacherRole, classes.create); //当前用户下创建班级 (用户必须是教师角色)


    api.get('/classes/me', auth.requireTeacherRole, classes.listMyClasses);

    api.route('/classes/:classId([a-f0-9]{24})')
        .get(classes.read) // 获取指定班级信息
        .put(auth.requireTeacherRole, classes.update) // 修改指定班级信息
        .delete(auth.requireTeacherRole, classes.delete);

    api.route('/classes/:classId([a-f0-9]{24})/changeOwner').put(classes.changeOwner);


    api.route('/teachers/:teacherId([a-f0-9]{24})/classes')
        .get(classes.listByOwner)       // 获取指定教师的班级列表
        .post(auth.requireTeacherRole, classes.create);        //  在指定教师下创建班级

};