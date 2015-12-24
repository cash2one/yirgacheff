/**
 * Created by Frank on 15/12/17.
 */
'use strict';
const url = require('url');
const passport = require('koa-passport');
const roles = require('../common/constants').roles;

module.exports = function (router) {

    router.get('/', function*() {
        let user = this.user;
        this.redirect(indexByUser(user));
    });

    router.get('/login', function*() {
        yield this.render('backend/login');
    });

    router.post('/login', function*(next) {
        var ctx = this;
        yield passport.authenticate('local', {session: false},
            function*(err, user, info) {
                if (err || !user) {
                    yield ctx.render('backend/login', {error: (err && err.message) || '用户不存在'});
                    return;
                }
                ctx.cookies.set('jwt', user.accessToken(), {signed: true});
                let next = url.parse(ctx.request.get('referer'), true).query.next;
                ctx.redirect('/');
            }).call(this, next);
    });


    router.get('/logout', function*() {
        this.cookies.set('jwt', null);
        this.redirect('/');
    });

    return router;
};

function indexByUser(user) {

    if (!user) {
        return '/login';
    }
    if (user.role === roles.HEADMASTER) {
        return '/school/home';
    }
    if (user.role === roles.TEACHER) {
        return '/teacher/home'
    }
}