/**
 * Created by Frank on 15/12/23.
 */
'use strict';
const service = require('../../../services');
module.exports = function (router) {

    router.get('/', function*() {
        let query = this.query;
        let state = query.state;
        let user = this.user;
        let filter = {
            where: {},
            fields: ['-answer', '-schoolId'],
            include: [{'student': 'displayName username'}]
        };
        if (state) {
            filter.where.state = state;
        }
        if (state === '1') {
            filter.include.push({'teacher': 'displayName'});
        }
        this.body = yield service.question.findBySchool(user.schoolId, filter);

    });

    router.post('/', function*() {
        let user = this.user;
        let answer = this.request.body.answer;
        let questionId = this.request.body.questionId;
        this.body = yield service.question.addAnswer(user._id, questionId, answer);
    });




    return router;
};