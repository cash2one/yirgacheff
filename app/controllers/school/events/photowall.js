/**
 * Created by Admin on 2016/1/10.
 */
'use strict';

const service = require('../../../services');

module.exports = function (router) {

    router.get('/edit', function*() {
        yield this.render('common/events/photo-wall');
    });

};
