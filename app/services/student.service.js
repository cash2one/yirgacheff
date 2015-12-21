/**
 * Created by Frank on 15/12/18.
 */
'use strict';
const mongoose = require('mongoose');
const co = require('co');
const moment = require('moment');
const _ = require('lodash');
const math = require('mathjs');
require('moment-range');
const queryBuilder = require('../functions/queryBuilder');
const Student = mongoose.model('Student');
const Class = mongoose.model('Class');
const ObjectId = mongoose.Types.ObjectId;

module.exports = {

    /**
     *  获取指定学校的学生数量
     */
    countBySchool: co.wrap(function* (schoolId, filter) {
        let query = Student.where('schoolId', schoolId);
        if (_.isEmpty(filter)) {
            return yield query.where('state', 0).count();
        }
        _.defaultsDeep(filter, {where: {state: 0}}); //如果没有设置状态位,默认设置位0
        queryBuilder(query, filter);
        return yield query.count();
    }),

    /**
     *
     * 获取指定教师的学生数量
     *
     */
    countByTeacher: co.wrap(function*(teacherId) {
        let classes = yield Class.find({
            owner: teacherId
        }).select('_id').exec();

        return yield Student.count({
            classes: {$in: classes}
        }).exec();

    }),

    /**
     * 根据班级ID 获取学生数量
     */
    countByClass: co.wrap(function*(classId) {
        return yield Student.count({classes: classId}).exec();
    }),

    /**
     * 根据学校ID获取学生列表
     */
    findBySchool: co.wrap(function*(schoolId, filter) {
        let query = Student.find({
            schoolId: schoolId
        });
        if (_.isEmpty(filter)) {
            return yield query.where('state', 0).lean().exec();
        }
        _.defaultsDeep(filter, {where: {state: 0}}); //如果没有设置状态位,默认设置位0
        queryBuilder(query, filter);
        return yield query.lean().exec();
    }),


    /**
     * 根据班级ID获取学生列表
     */
    findByClass: co.wrap(function*(classId, filter) {
        let query = Student.find({
            classes: classId
        }).lean();
        if (_.isEmpty(filter)) {
            return yield query.exec();
        }
        queryBuilder(query, filter);
        return yield query.exec();
    }),


    /**
     * 根据教师ID获取学生列表
     */
    findByTeacher: co.wrap(function*(teacherId, filter) {


    }),

    /**
     * 学生入学统计
     */
    enrollDistributed: co.wrap(function*(type, schoolId) {
        let start = null;
        let end = null;
        if (type === 'lastSixMonths') {
            start = moment().subtract(5, 'month').startOf('month');
            end = moment().endOf('month');
        } else if (type === 'lastTwelveMonths') {
            start = moment().subtract(11, 'month').startOf('month');
            end = moment().endOf('month');
        } else {
            start = moment().subtract(1, 'year').startOf('year');
            end = moment().subtract(1, 'year').endOf('year');
        }
        let range = moment.range(start, end);
        let aggregates = yield Student.aggregate()
            .match({
                schoolId: new ObjectId(schoolId),
                createdTime: {$gte: start, $lte: end}
            })
            .project({
                _id: 0,
                gender: 1,
                yearMonth: {$dateToString: {format: "%Y-%m", date: "$createdTime"}}
            })
            .group({
                _id: {
                    yearMonth: '$yearMonth',
                    gender: '$gender'
                },
                studentsCount: {$sum: 1}
            }).exec();

        let categories = [];
        let series = [];
        let boys = [];
        let girls = [];
        let total = [];
        range.by('month', moment => {
            categories.push(moment.format('YYYY-MM'));
        });
        aggregates = _.groupBy(aggregates, aggregate => {
            return aggregate._id.yearMonth;
        });
        for (let i = 0; i < categories.length; i++) {
            let aggregate = aggregates[categories[i]];
            let boyCount = 0, girlCount = 0, totalCount = 0;
            if (aggregate) {
                let first = aggregate[0];
                let second = aggregate.length > 1 ? aggregate[1] : null;
                boyCount = first._id.gender === '男' ? first.studentsCount : 0;
                girlCount = first._id.gender === '女' ? first.studentsCount : 0;
                if (boyCount === 0 && second) {
                    boyCount = second.studentsCount;
                } else if (girlCount === 0 && second) {
                    girlCount = second.studentsCount;
                }
                totalCount = boyCount + girlCount;
            }
            boys[i] = boyCount;
            girls[i] = girlCount;
            total[i] = totalCount;
        }
        series[0] = boys;
        series[1] = girls;
        series[2] = total;
        return {
            series: series,
            categories: categories
        };
    })


    , /**
     *
     * 学生积分分布
     *
     */
    scoreDistributed: co.wrap(function*(schoolId) {
        let students = yield Student.find({schoolId: schoolId})
            .select('score -_id')
            .sort('-score')
            .limit(1).exec();

        if (!students || students.length === 0) {
            return {categories: [], series: []};
        }
        let maxScore = students[0].score;
        let interval = calculateInterval(maxScore);
        let categories = [];
        let series = _.fill(new Array(10), 0);
        _.times(10, function (n) {
            let start = n * interval;
            let end = (n + 1) * interval;
            categories.push(start + ' - ' + end);
        });
        if (maxScore == 0) {
            return {categories: categories, series: series};
        }
        let mapReduce = {
            query: {
                schoolId: new ObjectId(schoolId),
                state: 0
            },
            scope: {
                interval: interval
            },
            map: function () {
                let index = Math.floor(this.score / interval);
                emit(index + '', 1);
            },

            reduce: function (key, values) {
                return Array.sum(values);
            }
        };
        let results = yield Student.mapReduce(mapReduce);
        _.forEach(results, result => {
            series[parseInt(result._id)] = result.value;
        });
        return {categories: categories, series: series};
    })

};


// 根据积分数计算组距
function calculateInterval(score, groupNum) {
    if (score < 100) {
        return 10;
    }
    groupNum = groupNum || 10;
    var maxStr = score + '',
        firstNum = parseInt(maxStr[0]),
        figure = maxStr.length,
        max = 0;
    if (firstNum > 9) {
        max = math.pow(10, figure);
    } else {
        max = (firstNum + 1) * math.pow(10, figure - 1);
    }
    return max / groupNum;
}