/**
 * Created by Frank on 15/12/22.
 */
'use strict';
module.exports = function (router) {

    router.get('/', function*() {
        yield this.render('backend/teacher/profile');
    });

    return router;

};