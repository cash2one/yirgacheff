'use strict';

/**
 * Module dependencies.
 */
var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var config = require('./config');
var swig = require('./swigExt');
var path = require('path');
var _ = require('lodash');
var requireDir = require('require-dir');


/**
 * Config local variables
 * @param app
 */
module.exports.initLocalVariables = function (app) {
    app.locals.title = config.app.title;
    app.locals.description = config.app.description;
    app.locals.keywords = config.app.keywords;
    app.locals.resourceURL = config.qn.visitUrl;
};

/**
 * Config middleware
 * @param app
 */
module.exports.initMiddleware = function (app) {
    app.set('showStackError', true);
    app.use(bodyParser.urlencoded({
        limit: '2048kb',
        extended: true
    }));
    app.use(bodyParser.json({
        limit: '2048kb'
    }));
};


/**
 * Config session
 * @param app
 * @param redis
 */
module.exports.initSession = function (app, redis) {
    var RedisStore = require('connect-redis')(session);
    app.use(session({
        saveUninitialized: false,
        resave: false,
        secret: config.sessionSecret,
        cookie: {maxAge: 1000 * 3600 * 3}, // 3个小时过期时间
        store: new RedisStore({client: redis})
    }));
};

/**
 * Config passport
 * @param app
 */
module.exports.initPassport = function (app) {
    app.use(passport.initialize());
    app.use(passport.session());
    require('./passport')();
};


/**
 * Config view engine
 * @param app
 */
module.exports.initViewEngine = function (app) {
    // Set swig as the template engine
    app.engine('html', swig.renderFile);
    // Set views path and view engine
    app.set('view engine', 'html');
    app.set('views', './app/views');
};


/**
 * Config env
 * @param app
 */
module.exports.initEnv = function (app) {
    if (process.env.NODE_ENV === 'production') {
        return;
    }
    app.use(express.static(path.resolve('./public')));

};

/**
 * Load server models
 * @param app
 */
module.exports.initServerModels = function (app) {
    require('../app/models');
};

/**
 * Load server routes
 * @param app
 */
module.exports.initServerRoutes = function (app) {
    _.forEach(requireDir('../app/routes'), function (route) {
        route(app);
    });
};


/**
 * Configure error handling
 */
module.exports.initErrorRoutes = function (app) {
    // 页面错误处理
    app.use(function (err, req, res, next) {
        if (err.stack) {
            console.error(err, err.stack);
        }
        var message = typeof err === 'string' ? err : err.message;
        if (/\/api\/v1\//.test(req.url)) {
            return res.status(400).json({
                message: message
            })
        }
        res.render('500', {message: message});
    });

    //处理404
    app.use(function (req, res, next) {
        res.status(404).format({
            'text/html': function () {
                res.render('404', {
                    url: req.originalUrl
                });
            },
            'application/json': function () {
                res.json({
                    error: 'Path not found'
                });
            },
            'default': function () {
                res.send('Path not found');
            }
        });
    });
};


module.exports.init = function (redis) {
    var app = express();
    this.initLocalVariables(app);
    this.initMiddleware(app);
    this.initSession(app, redis);
    this.initViewEngine(app);
    this.initEnv(app);
    this.initPassport(app);
    this.initServerModels(app);
    this.initServerRoutes(app);
    this.initErrorRoutes(app);
    return app;

};

