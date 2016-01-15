/**
 * Created by Frank on 16/1/7.
 */
'use strict';
const service = require('../../../services');

module.exports = function (router) {

    router.post('/', function*() {
        let user = this.user;
        this.body = yield service.homework.create(user, this.request.body);
    });

    router.delete('/:homeworkId', function*() {
        let homeworkId = this.params.homeworkId;
        this.body = yield service.homework.deleteById(homeworkId);
    });

    router.put('/:homeworkId/close', function*() {
        let homeworkId = this.params.homeworkId;
        this.body = yield service.homework.closeById(homeworkId);
    });

    router.put('/:homeworkId/students/:studentId/award', function*() {
        let studentId = this.params.studentId;
        let homeworkId = this.params.homeworkId;
        let comment = {
            teacher: this.user._id,
            content: this.request.body.comment
        };
        this.body = yield service.homework.addComment(studentId, homeworkId, comment);

    });

    return router;
};