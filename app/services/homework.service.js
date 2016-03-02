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
const Teacher = mongoose.model('Teacher');
const Student = mongoose.model('Student');
const Class = mongoose.model('Class');
const Quiz = mongoose.model('Quiz');

module.exports = {

    create: co.wrap((function*(user, data) {
        let teacher = yield Teacher.findById(user._id).lean().exec();
        let homework = data;
        let exercises = data.exercises;
        let classes = homework.classes;
        let asTemplate = homework.addQuizBase;
        if (!_.isArray(exercises)) {
            exercises = _.values(exercises);
        }
        let quiz = new Quiz({
            title: homework.title,
            creator: teacher,
            creatorDisplayName: teacher.displayName,
            creatorUsername: teacher.username,
            exercises: exercises,
            asTemplate: asTemplate,
            schoolId: teacher.schoolId
        });

        let studentsList = yield _.map(classes, clazz=> {
            return Student.find({classes: clazz}).select('_id').lean().exec();
        });

        let homeworkList = [];
        for (let i = 0; i < studentsList.length; i++) {
            let students = studentsList[i];
            let clazz = classes[i];
            if (students.length === 0) {
                continue;
            }
            homeworkList.push(_.extend({}, homework, {
                clazz: clazz,
                quiz: quiz,
                performances: _.map(students, student=> {
                    return {student: student._id};
                }),
                schoolId: teacher.schoolId,
                exerciseCount: quiz.exercises.length,
                statistics: {
                    studentCount: students.length,
                    studentCountOfFinished: 0
                }
            }));
        }
        if (homeworkList.length > 0) {
            //保存题目信息

            yield quiz.save();
            //保存作业信息
            yield Homework.create(homeworkList);
        }
        return true;
    })),

    deleteById: co.wrap(function*(id) {
        let homework = yield Homework.findById(id).select('state quiz').exec();
        if (!homework || homework.state !== 0) {
            throw createError(400, '作业不存在或无法删除');
        }
        let quiz = homework.quiz;
        yield homework.remove();
        yield Quiz.remove({
            _id: quiz,
            asTemplate: false
        }).exec();

        return true;
    }),

    closeById: co.wrap(function*(id) {
        let homework = yield Homework.findById(id)
            .populate('performances.student', 'username displayName')
            .populate('clazz className').exec();
        if (!homework || homework.state !== 0) {
            throw createError(400, '作业不存在或无法删除');
        }
        homework = executeStatistics(homework);
        homework.state = 1;
        homework.className = homework.clazz.className;
        return yield homework.save();

    }),

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
                exercise.wrongAnswer = wrong.answer;
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
    }),

    addComment: co.wrap(function*(studentId, homeworkId, comment) {
        yield Homework.update({
            _id: homeworkId,
            'performances.student': studentId
        }, {
            $set: {
                'performances.$.state': 2,
                'performances.$.comment': comment
            }
        }).exec();
        return true

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
