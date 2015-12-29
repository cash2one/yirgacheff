'use strict';

var config = require('../config');
if (!config.tasks.js) return;

const path = require('path');
const fs = require('fs');
const walk = require('walk');
const webpack = require('webpack');
const webpackManifest = require('./webpackManifest');

function makeConf(env) {
    var jsSrc = path.resolve(config.root.src, config.tasks.js.src);
    var jsDest = path.resolve(config.root.dest, config.tasks.js.dest);
    var publicPath = path.join(config.tasks.js.dest, '/');
    var filenamePattern = env === 'production' ? '[name]-[hash].js' : '[name].js';
    var extensions = config.tasks.js.extensions.map(function (extension) {
        return '.' + extension
    });

    var webpackConfig = {
        context: jsSrc,
        resolve: {
            root: jsSrc,
            extensions: [''].concat(extensions),
            alias: {
                'bootstrap': 'bootstrap/dist/js/bootstrap',
                'slimscroll': 'jquery-slimscroll/jquery.slimscroll.min',
                'moment': 'moment/moment.js',
                'highcharts': 'highcharts/highcharts.js',
                'datatables': 'datatables/media/js/jquery.dataTables.js',
                'bootstrap-notify':'bootstrap-notify/bootstrap-notify.min.js'
            }
        },
        module: {
            noParse: [/moment/, /underscore/, /jquery/, /datatables/, /fullcalendar/,/bootstrap/,/bootstrap-notify/],
            loaders: [
                {test: require.resolve('jquery'), loader: 'expose?jQuery'},
                {test: require.resolve('jquery'), loader: 'expose?$'},
                {test: /\.coffee$/, loader: "coffee-loader"},
                {test: /\.(coffee\.md|litcoffee)$/, loader: "coffee-loader?literate"},
                {test: /\.css$/, loader: "style-loader!css-loader?root=.."},
                {test: /\.jpe?g$|\.gif$|\.png$/i, loader: "url-loader?limit=8192&name=[path][name].[ext]"}

            ]
        },
        plugins: [
            new webpack.ProvidePlugin({
                $: "jquery",
                jQuery: "jquery",
                "window.jQuery": "jquery"
            })
        ]
    };

    if (env !== 'test') {

        // Karma doesn't need entry points or output settings
        webpackConfig.entry = genEntries(jsSrc);

        webpackConfig.output = {
            path: path.normalize(jsDest),
            filename: filenamePattern,
            publicPath: publicPath
        };

        if (config.tasks.js.extractSharedJs) {
            // Factor out common dependencies into a shared.js
            webpackConfig.plugins.push(
                new webpack.optimize.CommonsChunkPlugin({
                    name: 'shared',
                    filename: filenamePattern
                })
            )
        }
    }

    if (env === 'development') {
        webpackConfig.devtool = 'source-map';
        webpack.debug = true
    }

    if (env === 'production') {
        webpackConfig.plugins.push(
            new webpackManifest(publicPath, config.root.dest),
            new webpack.DefinePlugin({
                'process.env': {
                    'NODE_ENV': JSON.stringify('production')
                }
            }),
            new webpack.optimize.DedupePlugin(),
            new webpack.optimize.UglifyJsPlugin(),
            new webpack.NoErrorsPlugin()
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

module.exports = makeConf;
