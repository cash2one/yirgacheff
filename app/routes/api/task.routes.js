/**
 *
 * Created by Frank on 15/7/27.
 */

var task = require('../../api/v1/task.api');

module.exports = function (api) {

    api.get('/tasks', task.listTasks);      // 任务列表

    api.put('/tasks/:taskId([a-f0-9]{24})', task.updateTask);

    api.get('/tasks/:taskId([a-f0-9]{24})', task.readTask);  //任务详情

    api.put('/tasks/:taskId([a-f0-9]{24})/close', task.closeTask);  //关闭任务

    api.delete('/tasks/:taskId([a-f0-9]{24})', task.deleteTask);  //删除任务

    api.param('taskId', task.taskById);

};
