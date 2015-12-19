/**
 * Created by Frank on 15/12/18.
 */

'use strict';
const mongoose = require('mongoose');
const co = require('co');
const createError = require('http-errors');
const roles = require('../common/constants').roles;
const School = mongoose.model('School');
const Teacher = mongoose.model('Teacher');


module.exports = {

    modifyPassword: co.wrap(function*(userInfo, data) {
        var password = data.password;
        var newPassword = data.newPassword;
        var role = userInfo.role;
        var UserModel = null;
        if (role === roles.HEADMASTER) {
            UserModel = School
        } else if (role === roles.TEACHER) {
            UserModel = Teacher;
        }
        let user = UserModel.findById(userInfo._id).exec();
        if (!user.authenticate(password)) {
            throw createError(400, '原始密码错误');
        }
        user.password = newPassword;
        yield user.save();
    }),

    getUserByIdAndRole: co.wrap(function*(id, role) {
        if (role === roles.HEADMASTER) {
            return yield School.findById(id).select('-password -salt').lean().exec();
        }
        if (role === roles.TEACHER) {
            return yield Teacher.findById(id).select('-password').lean().exec();
        }
        return null;
    })

};