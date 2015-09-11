/**
 * Created by Frank on 15/5/6.
 */
'use strict';
var _ = require('lodash');
var schoolMenus = require('../../common/menus').schoolMenus;
var models = require('../../models');
var ScoreExchange = models.ScoreExchange;
var ScoreExchangeInstruction = models.ScoreExchangeInstruction;


/**
 * 学校积分商城
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
exports.scoreMall = function (req, res, next) {
    ScoreExchange.find({
        schoolId: req.user.schoolId
    }).select('-createdTime,-schoolId').lean().exec(function (err, products) {
        if (err) {
            return next(err);
        }
        return res.render('backend/school/scores/list-products',
            _.assign({exchanges: products}, schoolMenus.scoreMall));
    });
};

/**
 * 积分兑换说明
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
exports.scoreExplanation = function (req, res, next) {
    ScoreExchangeInstruction.findOne({schoolId: req.user.schoolId},
        function (err, instruction) {
            if (err) {
                return next(err);
            }
            return res.render('backend/school/scores/view-exchange-instruction',
                _.assign({instruction: instruction}, schoolMenus.score.instruction));
        });
};
