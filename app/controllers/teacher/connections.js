/**
 * Created by Frank on 15/12/23.
 */
'use strict';
const _ = require('lodash');
const service = require('../../services');

module.exports = function (router) {

    router.get('/', function*() {
        let user = this.user;
        this.state.classes = yield service.classes.findByTeacher(user._id, {
            fields: ['className']
        });

        yield this.render('backend/teacher/connetion_pipe');

    });

    router.get('/:studentId([a-f0-9]{24})', function*() {
        let studentId = this.params.studentId;
        let result = yield {
            student: service.students.findById(studentId, true),
            records: service.connections.findByStudent(studentId, {
                include: [{'creator': 'displayName'}],
                order: ['-createdTime']
            })
        };
        _.assign(this.state, result);
        yield this.render('backend/teacher/connetion_pipe_detail');
    });

    return router;
};