/**
 * Created by Frank on 15/12/18.
 */
'use strict';
const _ = require('lodash');
const service = require('../../services');

module.exports = function (router) {

    router.get('/', function*() {

        let user = this.user;
        let classes = yield service.classes.findBySchool(user.schoolId);

        //获取每个班级的学生数量
        //TODO 加入缓存处理
        let counts = yield _.map(classes, clazz => {
            return service.students.countByClass(clazz._id);
        });
        _.forEach(classes, (clazz, index) => {
            clazz.studentsCount = counts[index];
        });
        this.state.classes = classes;
        yield this.render('backend/school/manager/list-classes');
    });


    router.get('/:id', function*() {
        let classId = this.params.id;
        let result = yield {
            clazz: service.classes.findById(classId),
            students: service.students.findByClass(classId)
        };
        _.assign(this.state, result);
        yield this.render('backend/school/manager/view-class');

    });

    return router;
};