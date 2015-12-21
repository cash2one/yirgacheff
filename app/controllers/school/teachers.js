/**
 * Created by Frank on 15/12/18.
 */
'use strict';

module.exports = function (router) {

    router.get('/', function*() {
        yield this.render('backend/school/manager/list-teachers');
    });

    router.get('/disabled', function*() {
        yield this.render('backend/school/manager/list-teachers-disabled');
    });

    return router;
};