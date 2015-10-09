'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash');

/**
 * 教师controller 入口
 * @type {Object}
 */
module.exports = _.extend(
    require('./teachers/connections.controller'),
    require('./teachers/core.controller'),
    require('./teachers/homework.controller'),
    require('./teachers/manager.controller'),
    require('./teachers/quiz.controller'),
    require('./teachers/schedule.controller'),
    require('./teachers/quest.controller')
);
