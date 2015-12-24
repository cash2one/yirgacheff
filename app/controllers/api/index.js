/**
 * Created by Frank on 15/12/18.
 */
'use strict';

module.exports = [
    function*(next) {
        let start = new Date();
        yield next;
        let end = new Date();
    }
];