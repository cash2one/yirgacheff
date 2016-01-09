/**
 * Created by Frank on 15/12/23.
 */
'use strict';

const service = require('../../services');

module.exports = function (router) {

    router.get('/', function*() {
        yield this.render('teacher/questions/list-questions');
    });

    router.get('/:questionId([a-f0-9]{24})', function*() {

        let questionId = this.params.questionId;
        this.state.question = yield service.question.findById(questionId, true);
        yield this.render('teacher/questions/view-question');

    });

    return router;
};