/**
 * Created by Frank on 16/1/11.
 */
'use strict';

const mongoose = require('mongoose');
const Event = mongoose.model('Event');
const eventService = require('../../../../services').events.event;

module.exports = function (router) {

    router.get('/', function*() {
        let state = this.query.state || 0;
        this.body = yield eventService.findBySchool(this.user.schoolId, {
            where: {state: state}
        });
    });

    router.delete('/:id', function*() {
        this.body = yield eventService.deleteById(this.params.id);

    });

    router.post('/', function*() {
        let eventId = this.request.body.eventId;
        if (eventId) {
            this.body = yield eventService.updateById(eventId, this.request.body);
            return;
        }
        this.body = yield eventService.create(this.user, this.request.body);
    });

    router.put('/:id', function*() {
        this.body = yield eventService.updateById(this.params.id, this.request.body);
    });

};