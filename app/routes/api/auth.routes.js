/**
 * Created by Frank on 15/4/13.
 */

'use strict';

var auth = require('../../middlewares/api.auth');

module.exports = function (api) {
    api.put('/auth/modifyPassword', auth.modifyPassword);
};