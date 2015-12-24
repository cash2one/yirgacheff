/**
 * Created by Frank on 15/12/18.
 */

'use strict';
const mongoose = require('mongoose');
const co = require('co');
const _ = require('lodash');
const createError = require('http-errors');
const math = require('mathjs');
const queryBuilder = require('../functions/queryBuilder');
const Homework = mongoose.model('Homework');
const Class = mongoose.model('Class');

module.exports = {


    findByClasses: co.wrap(function*(classes, filter) {
        if (!_.isArray(classes)) {
            classes = [classes];
        }
        let query = Homework.where('clazz').in(classes);
        if (!_.isEmpty(filter)) {
            queryBuilder(query, filter);
        }
        return yield query.lean().exec();
    }),


    findByTeacher: co.wrap(function*(teacherId, filter) {
        let classes = yield Class.find({owner: teacherId}, '_id').exec();
        let query = Homework.where('clazz').in(classes);
        if (!_.isEmpty(filter)) {
            queryBuilder(query, filter);
        }
        return yield query.lean().exec();
    }),

    /**
     *  获取指定学校的作业数量
     */
    getCountBySchool: co.wrap(function* (schoolId) {
        return yield Homework.count({
            schoolId: schoolId
        }).exec();

    }),


    /**
     *
     * 获取指定教师的作业数量
     *
     */
    getCountByTeacher: co.wrap(function*(teacherId) {
        return yield Homework.count({
            creator: teacherId
        }).exec();
    }),

    /**
     *
     * 作业错题分布
     *
     */
    getWrongDistributed: co.wrap(function*(homeworkId) {

        let homework = yield  Homework.findById(homeworkId)
            .select('title quiz performances.wrongCollect')
            .populate('quiz', 'exercises.sequence')
            .lean().exec();
        if (!homework) {
            throw createError(400, '作业不存在');
        }
        let categories = [];
        let series = [];
        let info = {
            title: homework.title
        };
        _.forEach(homework.quiz.exercises, exercise => {
            categories.push('第' + exercise.sequence + '题');
        });
        let wrongMapper = _.chain(homework.performances)
            .pluck('wrongCollect')
            .flatten()
            .countBy('sequence').value();

        for (let i = 0; i < categories.length; i++) {
            var seq = i + 1 + '';
            series[i] = wrongMapper[seq] || 0;
        }
        return {info: info, series: series, categories: categories};
    }),

    /**
     * 班级作业详情
     */
    getClassHomework: co.wrap(function*(homeworkId) {
        let homework = yield Homework.findById(homeworkId)
            .populate('performances.student', 'username displayName')
            .lean().exec();

        if (!homework) {
            throw createError(400, '作业不存在');
        }
        return executeStatistics(homework);
    }),


    getStudentHomework: co.wrap(function*(studentId, homeworkId) {
        let homework = yield Homework.findOne({_id: homeworkId},
            {performances: {$elemMatch: {student: studentId}}})
            .select('quiz')
            .populate('quiz', 'exercises')
            .lean().exec();
        if (!homework) {
            throw createError(400, '作业不存在');
        }
        let performance = homework.performances[0];
        let exercises = homework.quiz.exercises;
        performance.homeworkId = homework._id.toString();
        let wrongCollect = performance.wrongCollect || [];
        let audioAnswers = performance.audioAnswers || [];
        _.forEach(wrongCollect, wrong => {
            let exercise = exercises[wrong.sequence - 1];
            if (exercise) {
                exercise.wrongAnswer = wrong.wrongAnswer;
            }
        });
        _.forEach(audioAnswers, audio => {
            let exercise = exercises[audio.sequence - 1];
            if (exercise) {
                exercise.audioAnswer = audio.answer;
            }
        });

        return {
            performance: performance,
            exercises: exercises
        };
    })

};


//计算作业统计值
function executeStatistics(homework) {
    if (homework.state === 1) {
        return homework;
    }
    let statistics = homework.statistics;
    let finishedStudents = _.filter(homework.performances, p => p.state !== 0);
    let finishedCount = statistics.studentCountOfFinished;
    if (finishedCount <= 0) {
        return homework;
    }
    //计算完成率
    statistics.finishRate = math.round(finishedCount / statistics.studentCount, 2);

    //计算错误率
    let totalWrongExercisesCount = _.sum(finishedStudents, student => {
        let wrongCollect = student.wrongCollect;
        return wrongCollect && wrongCollect.length || 0;
    });
    statistics.wrongRate = math.round(totalWrongExercisesCount / (finishedCount * homework.exerciseCount), 2);
    //计算平均完成时间
    let totalSpendSeconds = _.sum(finishedStudents, student => student.spendSeconds);
    statistics.averageSpendSeconds = math.round(totalSpendSeconds / finishedCount, 0);

    return homework;
}
