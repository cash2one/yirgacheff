/**
 * Created by Frank on 15/12/22.
 */
'use strict';
const service = require('../../services');

module.exports = function (router) {

    router.get('/', function*() {
        yield this.render('backend/teacher/manager/list-classes');
    });

    router.get('/:id',function*(){
        this.state.clazz = yield service.classes.findById(this.params.id,true);
        this.state.students = yield service.students.findByClass(this.params.id);
        yield this.render('backend/teacher/manager/list-students');
    });

    return router;
};