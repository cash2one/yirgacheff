/**
 * Created by Frank on 15/12/18.
 */
'use strict';

const service = require('../../services');

module.exports = function (router) {

    router.get('/', function*() {
        yield this.render('backend/school/site/list-categories');
    });

};