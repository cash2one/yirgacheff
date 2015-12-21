/**
 * Created by Frank on 15/12/18.
 */
'use strict';
const service = require('../../services');

module.exports = function (router) {

    router.get('/instruction', function*() {
        let user = this.user;
        this.state.instruction = yield service.score.getInstruction(user.schoolId);
        yield this.render('backend/school/scores/view-exchange-instruction');
    });


    router.get('/mall', function*() {
        let user = this.user;
        let filter = {
            fields: ['-createdTime', '-schoolId']
        };
        this.state.exchanges = yield service.score.getExchanges(user.schoolId, filter);
        yield this.render('backend/school/scores/list-products');
    });
};