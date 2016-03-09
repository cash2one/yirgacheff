/**
 * Created by Frank on 15/12/20.
 */
'use strict';
const service = require('../../../services');

module.exports = function (router) {


    router.get('/scoreExchanges', function*() {
        let user = this.user;
        this.body = yield service.score.getExchanges(user.schoolId);
    });

    router.post('/scoreExchangeInstructions', function*() {
        let user = this.user;
        let content = this.request.body.content;
        if (!content || '' === content.trim()) {
            return this.body = '';
        }
        this.body = yield service.score.addOrUpdateInstruction(user.schoolId, content);

    });

    router.post('/scoreExchanges', function*() {
        let user = this.user;
        let productId = this.request.body._id;
        if (productId && productId !== null) {
            this.body = yield service.score.updateExchangeById(productId, this.request.body);
        } else {
            this.body = yield service.score.addExchange(user.schoolId, this.request.body);
        }
    });

    router.delete('/scoreExchanges/:id', function*() {
        let exchangeId = this.params.id;
        this.body = yield service.score.deleteExchangeById(exchangeId);
    });


};