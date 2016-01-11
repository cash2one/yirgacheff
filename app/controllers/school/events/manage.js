/**
 * Created by Admin on 2016/1/11.
 */
'use strict';
const service = require('../../../services');

module.exports = function (router) {

    router.get('/:id', function*() {
        yield this.render('common/events/event-manage');
    });

};