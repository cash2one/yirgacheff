var config = require('../config');
if (!config.tasks.nodemon) return;

var gulp = require('gulp');
var handleErrors = require('../lib/handleErrors');
var nodemon = require('gulp-nodemon');
var browserSync = require('browser-sync');
var nodemonConfig = config.tasks.nodemon;
var BROWSER_SYNC_RELOAD_DELAY = 500;
var nodemonTask = function (cb) {
    var called = false;
    return nodemon(nodemonConfig)
        .on('start', function onStart() {
            if (!called) {
                cb();
            }
            called = true;
        })
        .on('restart', function onRestart() {
            console.log('restart server ...');
            // reload connected browsers after a slight delay
            setTimeout(function reload() {
                browserSync.reload({
                    stream: false
                });
            }, BROWSER_SYNC_RELOAD_DELAY);
        })
        .on('err', handleErrors);
};

gulp.task('nodemon', nodemonTask);
module.exports = nodemonTask;
