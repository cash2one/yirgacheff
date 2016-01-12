/**
 * Created by Frank on 16/1/11.
 */
'use strict';

const mongoose = require('mongoose');
const Event = mongoose.model('Event');
const service = require('../../../../services');

module.exports = function (router) {

    router.get('/', function*() {
        let state = this.query.state || 0;
        this.body = yield service.events.event.findBySchool(this.user.schoolId, {
            where: {state: state}
        });
    });

    router.delete('/:id', function*() {

    });

};