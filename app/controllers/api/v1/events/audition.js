/**
 * Created by Frank on 16/1/12.
 */

'use strict';
const mongoose = require('mongoose');
const Event = mongoose.model('Event');
const service = require('../../../../services').events.event;

module.exports = function (router) {

    router.post('/', function*() {
        let eventId = this.request.body.eventId;
        if (eventId) {
            this.body = yield service.updateById(eventId, this.request.body);
            return;
        }
        this.body = yield service.create(this.user, this.request.body);
    });

    router.put('/:id', function*() {
        this.body = yield service.updateById(this.params.id, this.request.body);
    });

};