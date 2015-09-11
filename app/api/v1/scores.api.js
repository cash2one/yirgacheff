'use strict';

var _ = require('lodash');
var models = require('../../models');
var ScoreExchange = models.ScoreExchange;
var ScoreExchangeInstruction = models.ScoreExchangeInstruction;

var api = exports = module.exports = {};


/**
 * 添加积分兑换商品
 * @param req
 * @param res
 */
api.addScoreExchange = function (req, res, next) {
    var data = _.assign(req.body, {
        schoolId: req.user.schoolId
    });
    var scoreExchange = new ScoreExchange(data);
    scoreExchange.save(function (err, scoreExchange) {
        if (err) {
            return next(err);
        }
        res.json(scoreExchange);
    });
};

/**
 * 删除兑换商品
 * @param req
 * @param res
 */
api.deleteScoreExchange = function (req, res, next) {
    ScoreExchange.remove({_id: req.params.scoreExchangeId}, function (err) {
        if (err) {
            return next(err);
        }
        return res.sendStatus(200);
    });
};


api.addScoreExchangeInstruction = function (req, res, next) {
    ScoreExchangeInstruction.findOneAndUpdate({schoolId: req.user.schoolId},
        {$set: {content: req.body.content, schoolId: req.user.schoolId}}, {upsert: true}, function (err, instruction) {
            if (err) {
                return next(err);
            }
            res.json(instruction);
        });
};


/**
 * 列出当前学校的兑换商品
 * @param req
 * @param res
 */
api.findScoreExchange = function (req, res, next) {
    ScoreExchange.find({schoolId: req.user.schoolId}, function (err, products) {
        if (err) {
            return next(err);
        }
        res.json(products);
    });

};
