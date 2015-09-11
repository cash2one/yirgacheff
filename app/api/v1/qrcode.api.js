/**
 * Created by Frank on 15/7/15.
 */

var _ = require('lodash');
var fs = require('fs');
var qrMaker = require('qr-image');
var DocTemplate = require('docxtemplater');
var ImageModule = require('docxtemplater-image-module');
var async = require('async');
var models = require('../../models');
var Student = models.Student;
var Clazz = models.Class;

exports.downloadStudentList = function (req, res, next) {
    var qrcode = req.qrcode;
    if (!qrcode) {
        return next('二维码不存在');
    }
    async.parallel({
        clazz: function (callback) {
            Clazz.findById(req.params.classId, 'className -_id')
                .lean()
                .exec(function (err, clazz) {
                    if (err || !clazz) {
                        return callback(err || '班级信息不存在');
                    }
                    callback(null, clazz);
                })
        },
        students: function (callback) {
            Student.find({
                classes: req.params.classId
            }).select('displayName username password -_id')
                .lean()
                .exec(function (err, students) {
                    console.log('students is ', students);
                    if (err || students.length === 0) {
                        return callback(err || '没有学生信息');
                    }
                    _.forEach(students, function (student) {
                        student.image = qrcode;
                    });
                    callback(null, students);
                });
        }
    }, function (err, result) {
        if (err) {
            return next(err);
        }
        var clazz = result.clazz;
        var students = result.students;
        var content = fs.readFileSync('./app/docx-template/student-list.docx', 'binary');
        //将image字段生成二维码数据
        var imageData = null;
        ImageModule.prototype.getImageFromData = function (image) {
            imageData = imageData || qrMaker.imageSync(image, {type: 'png'});
            return imageData;
        };
        var imageModule = new ImageModule({centered: false});
        imageModule.getSizeFromData = function () {
            return [92, 92];
        };
        var doc = new DocTemplate();
        doc.attachModule(imageModule)
            .load(content)
            .setData({
                className: clazz.className,
                students: students
            });

        doc.render();
        var buf = doc.getZip().generate({type: "nodebuffer"});
        var filename = '(' + clazz.className + ')' + '学生名单.docx';
        res.set({
            'Content-Type': 'application/msdoc',
            'Content-Length': buf.size,
            'Content-Disposition': 'attachment; filename="' + encodeURIComponent(filename) + '"'
        });
        res.send(buf);
    });
};
