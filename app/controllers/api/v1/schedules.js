/**
 * Created by Frank on 15/12/21.
 */
'use strict';
const service = require('../../../services');

module.exports = function (router) {
    router.get('/', function*() {
        let query = this.query;
        let user = this.user;
        let filter = {
            where: {
                'start': {gte: query.start},
                'end': {lte: query.end}
            }
        };

        this.body = yield service.schedules.findByUser(user._id, filter);
    });


    router.post('/', function*() {
        let user = this.user;
        let data = this.request.body;
        this.body = yield service.schedules.create(user, data);
    });


    router.put('/:id', function*() {
        let scheduleId = this.params.id;
        let data = this.request.body;
        this.body = yield service.schedules.updateById(scheduleId, data);
    });


    router.delete('/:id', function*() {
        let scheduleId = this.params.id;
        this.body = yield service.schedules.deleteById(scheduleId);
    });

    return router;
};