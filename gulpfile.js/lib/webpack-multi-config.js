'use strict';

var config = require('../config');
if (!config.tasks.js) return;

const path = require('path');
const fs = require('fs');
const walk = require('walk');
const webpack = require('webpack');
const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
const CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
const bower_modules = path.resolve(process.cwd(), './bower_components');
const node_modules = path.resolve(process.cwd(), './node_modules');

function makeConf(env) {
    var jsSrc = path.resolve(config.root.src, config.tasks.js.src);
    var jsDest = path.resolve(config.root.dest, config.tasks.js.dest);
    var publicPath = path.join(config.tasks.js.dest, '/');
    //var filenamePattern = env === 'production' ? '[name]-[hash].js' : '[name].js';
    var filenamePattern = '[name].js';
    var extensions = config.tasks.js.extensions.map(function (extension) {
        return '.' + extension
    });

    var webpackConfig = {
        context: jsSrc,
        resolve: {
            root: [jsSrc, node_modules, bower_modules],
            extensions: [''].concat(extensions),
            alias: sourceMap()
        },
        module: {
            loaders: [
                {test: /\.coffee$/, loader: "coffee-loader"},
                {test: /\.(coffee\.md|litcoffee)$/, loader: "coffee-loader?literate"},
                {test: /\.jpe?g$|\.gif$|\.png$/i, loader: "url-loader?limit=8192&name=[path][name].[ext]"}
            ]
        },
        externals: {
            "jquery": "window.jQuery",
            "moment": true

        },
        plugins: []
    };
    webpackConfig.entry = genEntries(jsSrc);
    webpackConfig.output = {
        path: path.normalize(jsDest),
        filename: filenamePattern,
        publicPath: publicPath
    };

    if (config.tasks.js.extractSharedJs) {
        webpackConfig.plugins.push(
            new CommonsChunkPlugin({
                name: 'shared',
                filename: filenamePattern
            })
        )
    }
    if (env === 'development') {
        webpackConfig.devtool = 'source-map';
        webpack.debug = true;
        let cssLoaders = {
            test: /\.css$/,
            loader: "style-loader!css-loader"
        };
        webpackConfig.module.loaders.push(cssLoaders);
    }
    if (env === 'production') {
        let cssLoader = {
            test: /\.css$/,
            loader: "style-loader!css-loader"
        };
        webpackConfig.module.loaders.push(cssLoader);
        webpackConfig.plugins.push(
            new UglifyJsPlugin()
        )
    }
    return webpackConfig
};

function genEntries(srcDir) {
    let map = {};
    walk.walkSync(srcDir, {
        listeners: {
            file: function (root, fileStats, next) {
                let name = fileStats.name;
                let m = name.match(/(.+)(\.js|\.coffee)$/);
                if (!m) {
                    return next();
                }
                let relativePath = path.relative(srcDir, root);
                let entry = path.join(relativePath, m[1]);
                map[entry] = path.join(relativePath, name);
                next();
            },
            errors: function (root, nodeStatsArray, next) {
                console.error('parse entries error!');
                next();
            }
        }
    });
    return map;
}

function sourceMap() {
    return {
        'slimscroll': 'jquery-slimscroll/jquery.slimscroll.min',
        'highcharts': 'highcharts/highcharts.js',
        'datatables': 'datatables/media/js/jquery.dataTables.js',
        'bootstrap-notify': 'bootstrap-notify/bootstrap-notify.min.js'
    };
}

module.exports = makeConf;
