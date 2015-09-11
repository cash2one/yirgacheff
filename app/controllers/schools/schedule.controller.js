/**
 *
 * Created by Frank on 15/6/5.
 */

'use strict';
var schoolMenus = require('../../common/menus').schoolMenus;

exports.listSchedulers = function (req, res, next) {
    return res.render('backend/school/scheduler/list-schedulers', schoolMenus.schedule);
};
