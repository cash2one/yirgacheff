/**
 * Created by Frank on 15/12/18.
 */

'use strict';
const mongoose = require('mongoose');
const co = require('co');
const _ = require('lodash');
const Homework = mongoose.model('Homework');


module.exports = {

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
            throw new Error('作业不存在');
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
    })

};
