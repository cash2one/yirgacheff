var config = require('../config');
if (!config.tasks.css) return;

var gulp = require('gulp');
var cssmin = require('gulp-cssmin');
var importCss = require('gulp-import-css');

var gulpif = require('gulp-if');
var browserSync = require('browser-sync');
var sourcemaps = require('gulp-sourcemaps');
var handleErrors = require('../lib/handleErrors');
var autoprefixer = require('gulp-autoprefixer');
var path = require('path');

var paths = {
    src: path.join(config.root.src, config.tasks.css.src, '/**/*.css'),
    dest: path.join(config.root.dest, config.tasks.css.dest)
};


var cssTask = function () {
    console.log(process.env.NODE_ENV);
    return gulp.src(paths.src)
        .pipe(sourcemaps.init())
        .on('error', handleErrors)
        .pipe(autoprefixer(config.tasks.css.autoprefixer))
        .pipe(sourcemaps.write())
        .pipe(gulpif(process.env.NODE_ENV == 'production', importCss()))
        .pipe(gulpif(process.env.NODE_ENV == 'production', cssmin()))
        .pipe(gulp.dest(paths.dest))
        .pipe(browserSync.stream())
};

gulp.task('css', cssTask);
module.exports = cssTask;
