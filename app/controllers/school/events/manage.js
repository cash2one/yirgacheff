/**
 * Created by Frank on 16/1/12.
 */
'use strict';
const service = require('../../../services');

module.exports = function (router) {

    router.get('/', function*() {
        yield this.render('common/events/list-events');
    });

    router.get('/:id([a-f0-9]{24})', function*() {
        let eventId = this.params.id;
        let event = yield service.events.event.findById(eventId, true);
        if (event.enroll) {
            event.enrollCount = yield service.events.enroll.getEnrollCount(event.enroll);
        }
        this.state.event = event;
        yield this.render('common/events/manage-event');
    });

    router.get('/:id([a-f0-9]{24})/enroll', function*() {
        let event = yield service.events.event.findById(this.params.id);
        if (event.enroll) {
            yield event.populate('enroll').execPopulate();
            this.state.enroll = event.enroll;
            this.state.enrollNames = yield service.events.enroll.getEnrollNames(event.enroll);
        }
        this.state.eventId = this.params.id;
        yield this.render('common/events/manage-enroll');
    });

    router.get('/:id([a-f0-9]{24})/task', function*() {
        this.state.eventId = this.params.id;
        yield this.render('common/events/manage-task');
    });

    return router;

};