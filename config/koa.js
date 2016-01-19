/**
 * Created by Frank on 15/12/17.
 */
'use strict';

const path = require('path');
const fs = require('fs');
const koa = require('koa');
const bodyParser = require('koa-bodyparser');
const session = require('koa-generic-session');
const error = require('koa-error');
const passport = require('koa-passport');
const flash = require('koa-flash');
const swig = require('koa-swig');
const forward = require('koa-forward-request');
const config = require('./config');
const router = require('./router');
const jwt = require('../app/middleware/jwt');

const app = koa();

/**
 * Config local variables
 * @param app
 */
function initLocalVariables(app) {
    app.use(function*(next) {
        this.state.title = config.app.title;
        this.state.description = config.app.description;
        this.state.keywords = config.app.keywords;
        this.state.resourceURL = config.qn.visitUrl;
        yield next;
    });
}


/**
 * Config middleware
 * @param app
 */
function initMiddleware(app) {
    app.use(flash());
    forward(app, {debug: true});
    app.use(bodyParser({
        jsonLimit: '5mb',
        formLimit: '128kb'
    }));

}


/**
 * Config session
 * @param app
 */
function initSession(app) {
    app.keys = config.keys;
    app.use(session());
}

function initJwt(app) {
    app.use(jwt());
}


/**
 * Config passport
 * @param app
 */
function initPassport(app) {
    app.use(passport.initialize());
    require('./passport')(passport);
}


/**
 * Config view engine
 * @param app
 */
function initViewEngine(app) {

    app.context.render = swig({
        root: path.resolve(__dirname, '../app/views'),
        autoescape: true,
        filters: require('./swigFilters'),
        cache: false, // disable, set to false
        ext: 'html',
        varControls: ['<<', '>>']
    });
}


/**
 * Config env
 * @param app
 */
function initStatic(app) {
    let staticPath = path.resolve(__dirname, '../assets'); // '../public'
    app.use(require('koa-static')(staticPath));
}

/**
 * Load server models
 * @param app
 */
function initServerModels(app) {
    require('../app/models');
}

/**
 * Load server routes
 * @param app
 */
function initServerRoutes(app) {
    app.use(router({
        directory: 'app/controllers'
    }));
}


/**
 * Configure error handling
 */
function initErrorRoutes(app) {
    // 页面错误处理
    app.use(error());
}

(function () {
    initLocalVariables(app);
    initSession(app);
    initMiddleware(app);
    initPassport(app);
    initViewEngine(app);
    initStatic(app);
    initServerModels(app);
    initJwt(app);
    initErrorRoutes(app);
    initServerRoutes(app);
})();

module.exports = app;
