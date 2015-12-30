/**
 * Created by Frank on 15/12/23.
 */
'use strict';
const service = require('../../services');
const quizzes = service.quizzes;

module.exports = function (router) {
    router.get('/', function*() {
        yield this.render('backend/teacher/quizBase/list-quizzes');

    });

    router.get('/create', function*() {
        yield this.render('backend/teacher/quizBase/create-quiz');
    });

    router.get('/:id([a-f0-9]{24})', function*() {
        let quizId = this.params.id;
        this.state.quiz = yield quizzes.findById(quizId, true);
        yield this.render('backend/teacher/quizBase/view-quiz');
    });


    return router;
};