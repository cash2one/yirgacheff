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
        this.state.event = yield service.events.event.findById(eventId, true);
        yield this.render('common/events/manage-event');
    });

    router.get('/:id([a-f0-9]{24})/enrolls', function*() {
        yield this.render('common/events/manage-enroll');
    });

    router.get('/:id([a-f0-9]{24})/task', function*() {
        let event = yield service.events.event.findById(this.params.id);
        if (event.task) {
            yield event.populate('task').execPopulate();
        }
        this.state.event = event;
        yield this.render('common/events/manage-task');
    });

    return router;

};