/**
 * Created by Frank on 16/2/27.
 */
'use strict';
const service = require('../services');
module.exports = (router)=> {
    router.post('/schools', function*() {
        let sk = this.query.secretKey;
        if (!sk || sk !== 'mooc1988') {
            this.throw(400, '非法请求');
        }
        this.body = yield service.schools.create(this.request.body);
    });
};