/**
 * Created by Frank on 15/12/18.
 */
'use strict';

const service = require('../../../services');

module.exports = function (router) {

    router.get('/edit', function*() {
        yield this.render('common/events/activity');

    });


};