/**
 * Created by Frank on 15/12/22.
 */
'use strict';
const _ = require('lodash');
const service = require('../../services');
module.exports = function (router) {

    router.get('/', function*() {
        let user = this.user;
        let classes = yield service.classes.findByTeacher(user._id);
        let homeworkList = yield service.homework.findByClasses(classes, {
            where: {state: 0},
            fields: ['clazz'],
            include: [{'clazz': 'className'}]
        });
        this.state.homeworkCount = homeworkList.length;
        this.state.classes = classes;
        this.state.homeworkList = _.take(homeworkList, 3);
        yield this.render('backend/teacher/home');
    });

    return router;

};