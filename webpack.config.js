/**
 * Created by Administrator on 2015/12/23.
 */
'use strict'

var webpack = require('webpack');
var path = require('path');
var entryMap = require('./entryMap');
var aliasMap = require('./aliasMap');

var configuration = {
    contenxt: __dirname,
    entry: entryMap,
    output: {
        libraryTarget: "var",
        path: __dirname,
        filename: '[name].bundle.js',
    },
    devtool: 'inline-source-map',
    debug:true,
    preLoaders: [
        {
            test: /\.js$/,
            loader: 'jshint-loader',
            exclude: /node_modules/,
        },
    ],
    module: {
        loaders: loaders()
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery"
        }),
    ],
    amd: {jQuery: true},
    resolve: {
        extensions: ['', '.js'],
        alias: aliasMap
    },
    externals: [{"window": "window"}],
    watch: true,

}

function loaders() {
    return [
        {   test: /\.(png|jpg|jpeg|gif)$/, loader: "url-loader"},
        {   test: /\.js$/,  loader: 'babel', exclude: /node_modules/},
        {   test: /\.css$/, loader: "style-loader!css-loader?minimize!autoprefixer-loader"},
    ]
}
module.exports = configuration;