/**
 * Created by Frank on 15/4/13.
 */

'use strict';

var schools = require('../../api/v1/schools.api');


module.exports = function (api) {
    api.put('/schools/:schoolId', schools.update);
};
