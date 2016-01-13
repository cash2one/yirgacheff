/**
 * Created by Frank on 16/1/12.
 */
'use strict';
const mongoose = require('mongoose');
const Event = mongoose.model('Event');
const service = require('../../../../services');
const activityService = service.events.activity;

module.exports = function (router) {


    router.post('/', function*() {
        let activityId = this.request.body.activityId;
        if (activityId) {
            this.body = yield activityService.updateById(activityId, this.request.body);
            return;
        }
        this.body = yield activityService.create(this.user, this.request.body);
    });


    router.put('/:id', function*() {
        let activityId = this.params.id;
        this.body = yield activityService.updateById(activityId, this.request.body);
    });

};