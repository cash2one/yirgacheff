/**
 * Created by Frank on 15/12/18.
 */
'use strict';



module.exports = function (router) {

    router.get('/', function*() {
        yield this.render('school/site/list-categories');
    });

};