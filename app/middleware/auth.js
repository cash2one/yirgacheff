/**
 * Created by Frank on 15/12/1.
 */
'use strict';
const service = require('../services');

module.exports = {

    requireLogin: function*(next) {
        if (this.user) {
            return yield next;
        }
        this.throw(401, 'require login');
    },

    userByToken: function*(next) {
        let user = this.user;
        if (!user) {
            this.throw(401, 'need login');
        }
        let role = user.role;
        user = yield service.users.getUserByIdAndRole(user._id, role);

        if (user === null) {
            this.throw(401, 'user not exist');
        }
        user.role = role;
        this.state.user = user;
        yield next;
    }
};