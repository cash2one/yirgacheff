/**
 * Created by Frank on 15/12/18.
 */
'use strict';
module.exports = {
    users: require('./user.service'),
    students: require('./student.service'),
    teachers: require('./teacher.service'),
    classes: require('./class.service'),
    homework: require('./homework.service'),
    score: require('./score.service'),
    schedules: require('./schedule.service'),
    quizzes: require('./quiz.service'),
    posts: require('./post.service'),
    categories: require('./category.service'),
    medias: require('./media.service'),
    tasks: require('./task/task.service'),
    activities: require('./task/activity.service'),
    connections: require('./connection.service'),
    question: require('./question.service')
};