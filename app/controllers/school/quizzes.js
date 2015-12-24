/**
 * Created by Frank on 15/12/18.
 */
'use strict';
const service = require('../../services');
const quizzes = service.quizzes;

module.exports = function (router) {

    router.get('/', function*() {
        yield this.render('backend/school/quizBase/list-quizzes');

    });

    router.get('/:id', function*() {
        let quizId = this.params.id;
        this.state.quiz = yield quizzes.findById(quizId, true);
        yield this.render('backend/school/quizBase/view-quiz');

    });

    return router;
};