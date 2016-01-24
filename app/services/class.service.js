/**
 * Created by Frank on 15/12/18.
 */

'use strict';
const fs = require('fs');
const path = require('path');
const qrMaker = require('qr-image');
const request = require('request-promise');
const DocTemplate = require('docxtemplater');
const ImageModule = require('docxtemplater-image-module');
const mongoose = require('mongoose');
const _ = require('lodash');
const co = require('co');
const createError = require('http-errors');
const queryBuilder = require('../functions/queryBuilder');
const config = require('../../config/config');
const Class = mongoose.model('Class');
const Teacher = mongoose.model('Teacher');
const Student = mongoose.model('Student');
const School = mongoose.model('School');


module.exports = {

    create: co.wrap(function*(user, data) {
        let clazz = new Class(data);
        let teacher = yield Teacher.findById(user._id)
            .select('_id displayName').lean().exec();
        _.assign(clazz, {
            owner: user._id,
            ownerDisplayName: teacher.displayName,
            ownerUsername: user.username,
            schoolId: user.schoolId
        });
        return yield clazz.save();

    }),

    /**
     *  获取指定学校的班级数量
     */
    countBySchool: co.wrap(function* (schoolId) {
        return yield Class.count({
            schoolId: schoolId,
            state: 0
        }).exec();

    }),

    /**
     *
     * 获取指定教师的班级数量
     *
     */
    countByTeacher: co.wrap(function*(teacherId) {
        return yield Class.count({
            owner: teacherId
        });
    }),


    /**
     * 根据学校ID查询班级列表
     */
    findBySchool: co.wrap(function*(schoolId, filter) {
        let query = Class.find({
            schoolId: schoolId
        });
        if (_.isEmpty(filter)) {
            return query.where('state', 0).lean().exec();
        }
        _.defaultsDeep(filter, {where: {state: 0}});
        queryBuilder(query, filter);
        return query.lean().exec();
    }),


    /**
     * 根据学校ID查询班级列表
     */
    findByTeacher: co.wrap(function*(teacherId, filter) {
        let query = Class.find({
            owner: teacherId
        });
        if (_.isEmpty(filter)) {
            return query.where('state', 0).lean().exec();
        }
        _.defaultsDeep(filter, {where: {state: 0}});
        queryBuilder(query, filter);
        return query.lean().exec();
    }),

    /**
     * 根据ID获取班级信息
     */
    findById: co.wrap(function*(id, lean) {
        let query = Class.findById(id);
        if (lean === true) {
            query.lean();
        }
        return yield query.exec();
    }),

    /**
     * 更换班级拥有者
     */
    changeOwner: co.wrap(function*(data) {

        if (!data || !data.username || !data.classId) {
            throw createError(400, '参数不完整');
        }

        let teacher = yield Teacher
            .findOne({username: data.username})
            .select('_id state displayName username').exec();

        if (!teacher) {
            throw createError(400, '教师不存在');
        }
        if (teacher.isDisabled()) {
            throw createError(400, '教师已禁用');
        }
        yield Class.update({_id: data.classId}, {
            $set: {
                owner: teacher,
                ownerDisplayName: teacher.displayName,
                ownerUsername: teacher.username
            }
        }).exec();
        return true;
    }),


    updateById: co.wrap(function*(id, data) {
        let clazz = yield Class.findById(id).exec();
        if (!clazz) {
            throw createError(400, '班级不存在');
        }
        _.assign(clazz, _.pick(data, ['className', 'courseTime']));
        return yield clazz.save();
    }),


    deleteById: co.wrap(function*(id) {
        let clazz = yield Class.findById(id).exec();
        if (!clazz) {
            throw createError(400, '班级不存在');
        }
        let studentCount = yield Student.count({classes: clazz}).exec();
        if (studentCount > 0) {
            throw createError(400, '班级拥有学生,无法删除');
        }
        clazz.state = 1;
        yield clazz.remove();
        return clazz;

    }),

    deleteStudentByIds: co.wrap(function*(classId, studentIds) {
        if (!_.isArray(studentIds)) {
            studentIds = [studentIds]
        }
        yield Student.where('_id').in(studentIds).update({},
            {$pull: {classes: classId}},
            {multi: true})
            .exec();
    }),

    addStudent: co.wrap(function*(classId, data) {
        let username = data.username;
        if (!username) {
            throw createError(400, '缺少学生信息');
        }
        let clazz = yield Class.findById(classId).select('schoolId').lean().exec();
        if (!clazz) {
            throw createError(400, '班级不存在');
        }
        let student = yield Student.findOne({
            username: username,
            schoolId: clazz.schoolId,
            state: 0
        }).exec();
        if (!student) {
            throw createError(400, '学生不存在');
        }
        if (student.classes.indexOf(clazz._id) !== -1) {
            throw createError(400, '学生已经在该班级');
        }
        student.classes.addToSet(clazz);
        return yield student.save();

    }),


    getDoc: co.wrap(function*(id, qrcode) {
        console.log(qrcode);
        let clazz = yield Class.findById(id).select('className schoolId').lean().exec();
        if (!clazz) {
            throw createError(400, '班级不存在');
        }
        let students = yield Student.find({classes: clazz._id})
            .select('displayName username password -_id')
            .lean().exec();

        if (students.length <= 0) {
            throw createError(400, '没有学生信息');
        }
        let imageData = null;
        if (qrcode.startsWith('http')) {
            imageData = qrMaker.imageSync(qrcode, {type: 'png'});
        } else {
            //学校私有二维码
            imageData = yield request({
                method: 'GET',
                uri: config.qn.visitUrl + '/' + qrcode,
                encoding: null
            });
        }

        ImageModule.prototype.getImageFromData = function (image) {
            console.log(imageData);
            return imageData;
        };
        let imageModule = new ImageModule({centered: false});
        imageModule.getSizeFromData = function () {
            return [92, 92];
        };
        let template = fs.readFileSync(path.resolve(__dirname, '../docx-template/student-list.docx'), 'binary');

        let doc = new DocTemplate()
            .attachModule(imageModule)
            .load(template)
            .setData({
                className: clazz.className,
                students: students,
                image: qrcode
            });
        doc.render();
        return doc.getZip().generate({type: 'nodebuffer'});
    })
};