'use strict';

var schedules = require('../../api/v1/schedule.api');

module.exports = function (api) {
    api.post('/schedules', schedules.add);
    api.get('/schedules', schedules.list);
    api.put('/schedules/:scheduleId([a-f0-9]{24})', schedules.modify);
    api.delete('/schedules/:scheduleId([a-f0-9]{24})', schedules.deleteById);
};
