/**
 * Created by Frank on 15/12/17.
 */
'use strict';

const auth = require('../../middleware/auth');

module.exports = [
    auth.requireLogin,
    auth.userByToken
];