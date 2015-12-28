/**
 * Created by Frank on 15/11/23.
 */
var config = require('../config');
if (!config.tasks.jsCopy) return;

var browserSync = require('browser-sync');
var changed = require('gulp-changed');
var gulp = require('gulp');
var path = require('path');

var paths = {
    src: path.join(config.root.src, config.tasks.jsCopy.src, '/**'),
    dest: path.join(config.root.dest, config.tasks.jsCopy.dest)
};

var jsCopyTask = function () {
    return gulp.src(paths.src)
        .pipe(changed(paths.dest)) // Ignore unchanged files
        .pipe(gulp.dest(paths.dest))
        .pipe(browserSync.stream())
};

gulp.task('jsCopy', jsCopyTask);
module.exports = jsCopyTask;