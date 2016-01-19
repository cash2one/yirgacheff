/**
 * Created by Frank on 15/12/21.
 */
'use strict';
const service = require('../../../services');

module.exports = function (router) {

    router.get('/', function*() {
        yield this.render('common/events/events');
    });

    router.get('/edit', function*() {
        let template = this.query.template;
        if (!template) {
            return this.redirect('/school/events');
        }
        yield this.render(`common/events/template/${template}`);
    });

    router.get('/edit/:id([a-f0-9]{24})', function*() {
        let eventId = this.params.id;
        let event = yield service.events.event.findById(eventId);
        let template = event.template;
        if (event.enroll) {
            yield event.populate('enroll', 'fields').execPopulate();
        }
        this.state.event = event;
        if (event.enroll) {
            this.state.enroll = event.enroll;
        }
        yield this.render(`common/events/template/${template}`);
    });

    return router;

};