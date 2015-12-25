/**
 * Created by Frank on 15/12/21.
 */
'use strict';
const service = require('../../../services');

module.exports = function (router) {

    router.get('/', function*() {
        let user = this.user;
        this.state.tasks = yield service.tasks.findBySchool(user.schoolId, {
            order: ['-createdTime']
        });
        yield this.render('backend/school/task/list-tasks');
    });

    router.get('/create', function*() {
        yield this.render('backend/school/task/create-task');
    });

    router.put('/:id', function*() {

    });

    router.get('/:id', function*() {
        let task = yield service.tasks.findById(this.params.id);
        this.state.task = task;
        switch (task.taskType) {
            case 0:
                return yield this.render('backend/school/task/post/view-post-task');
            case 1:
                this.state.collect = yield service.activities.getEnrolls(task.item._id);
                return yield this.render('backend/school/task/activity/view-activity-task');
        }
    });
};