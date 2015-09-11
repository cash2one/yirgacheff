/**
 *
 * Created by Frank on 15/6/5.
 */

'use strict';
var teacherMenus = require('../../common/menus').teacherMenus;

exports.listSchedulers = function (req, res, next) {
    return res.render('backend/teacher/scheduler/list-schedulers', teacherMenus.schedule);
};
