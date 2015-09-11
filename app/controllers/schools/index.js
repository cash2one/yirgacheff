/**
 * Created by Frank on 15/8/12.
 */


var controller = {
    core: require('./core.controller'),
    connections: require('./connections.controller'),
    score: require('./scores.controller'),
    quizBase: require('./quiz.controller'),
    manager: require('./manager.controller'),
    schedule: require('./schedule.controller'),
    site: require('./site.controller'),
    task: require('./task')
};

module.exports = exports = controller;
