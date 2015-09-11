/**
 * Created by Frank on 15/8/4.
 */

'use strict';
var _ = require('lodash');

var controller = _.assign(
    require('./task.controller'),
    require('./post.controller'),
    require('./activity.controller'),
    require('./lottery.controller')
);

module.exports = exports = controller;


