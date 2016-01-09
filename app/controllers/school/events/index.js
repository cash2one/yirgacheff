/**
 * Created by Frank on 15/12/21.
 */
'use strict';
const service = require('../../../services');

module.exports = function (router) {

    router.get('/list', function*() {
    });

    router.get('/', function*() {
        yield this.render('common/events/create');
    });

};