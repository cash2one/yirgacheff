var config = require('../config');
var gulp = require('gulp');
var gulpSequence = require('gulp-sequence');
var getEnabledTasks = require('../lib/getEnabledTasks');

//设置环境变量
process.env.NODE_ENV = 'production';
var productionTask = function (cb) {
    var tasks = getEnabledTasks('production');
    //TODO 版本号
    gulpSequence('clean', tasks.assetTasks, tasks.codeTasks, cb)
};

gulp.task('production', productionTask);
module.exports = productionTask;
