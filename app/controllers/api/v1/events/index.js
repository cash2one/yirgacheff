/**
 * Created by Frank on 16/1/11.
 */
'use strict';

const mongoose = require('mongoose');
const Event = mongoose.model('Event');
const eventService = require('../../../../services').events.event;

module.exports = function(router) {

  router.get('/', function*() {
    let query = this.query;
    let filter = {};
    if (query.limit) {
      filter.limit = query.limit;
    }
    if (query.skip) {
      filter.skip = query.skip;
    }
    if (query.template && query.template !== 'all') {
      filter.where = {
        template: query.template
      };
    }
    filter.order = ['-createdTime'];
    filter.fields = [
      'title coverImage visit like tags template createdTime'
    ];
    this.body = yield {
      events: eventService.findBySchool(this.user.schoolId, filter),
      total: eventService.countBySchool(this.user.schoolId, query.template)
    }
  });

  router.delete('/:id([a-f0-9]{24})', function*() {
    this.body = yield eventService.deleteById(this.params.id);

  });

  //添加或修改活动
  router.post('/', function*() {
    let eventId = this.request.body.eventId;
    if (eventId) {
      return this.body = yield eventService.updateById(eventId, this.request
        .body);
    }
    this.body = yield eventService.create(this.user, this.request.body);
  });

  //修改活动
  router.put('/:id([a-f0-9]{24})', function*() {
    this.body = yield eventService.updateById(this.params.id, this.request
      .body);
  });


  router.get('/:eventId([a-f0-9]{24})/tasks', function*() {
    this.body = yield eventService.getTasksByEvent(this.params.eventId);
  });


  router.post('/:eventId([a-f0-9]{24})/tasks', function*() {
    let data = this.request.body;
    let taskId = data._id;
    if (taskId && taskId !== null) {
      this.body = yield eventService.updateTaskById(taskId, data);
    } else {
      this.body = yield eventService.addTask(this.params.eventId, data);
    }
  });


  router.delete('/:eventId([a-f0-9]{24})/tasks/:taskId([a-f0-9]{24})',
    function*() {
      this.body = yield eventService.deleteTask(this.params.eventId, this.params
        .taskId);
    });


  router.put('/:eventId([a-f0-9]{24})/tasks/:taskId([a-f0-9]{24})/open',
    function*() {
      this.body = yield eventService.openTaskById(this.params.taskId);
    });


  router.put('/:eventId([a-f0-9]{24})/tasks/:taskId([a-f0-9]{24})/close',
    function*() {
      this.body = yield eventService.closeTaskById(this.params.taskId);
    });


  return router;

};
