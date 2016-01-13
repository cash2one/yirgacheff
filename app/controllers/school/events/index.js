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

    router.get('/edit/:id', function*() {
        let eventId = this.params.id;
        let event = yield service.events.event.findById(eventId, true);
        let template = event.template;
        this.state.event = event;
        yield this.render(`common/events/template/${template}`);
    });

    return router;

};