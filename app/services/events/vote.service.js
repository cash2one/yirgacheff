'use strict';

const co = require('co');
const _ = require('lodash');
const createError = require('http-errors');
const mongoose = require('mongoose');
const queryBuilder = require('../../functions/queryBuilder');

const VotePlayer = mongoose.model('VotePlayer');
const Vote = mongoose.model('Event').discriminators.vote;

module.exports = {

    addPlayer: co.wrap(function *(data) {
        let voteId = data.vote;
        let vote = yield Vote.findByIdAndUpdate(voteId, {$inc: {playerCounter: 1}}, {
                new: true,
                select: ['playerCounter']
            })
            .exec();
        if (!vote) {
            throw createError(400, '投票不存在');
        }
        data.sequence = vote.playerCounter + '';
        let player = new VotePlayer(data);
        return yield player.save();
    }),


    deletePlayerById: co.wrap(function*(playerId) {
        return yield VotePlayer.remove({
            _id: playerId
        }).exec();
    }),

    updatePlayer: co.wrap(function *(id, data) {
        let player = yield VotePlayer.findById(id);
        if (!player) {
            throw createError(400, '选手不存在');
        }
        _.assign(player, data);
        return yield player.save();
    }),

    findPlayers: co.wrap(function *(filter) {
        let query = VotePlayer.find({vote: filter.vote});
        let page = parseInt(filter.page || 1);
        let limit = parseInt(filter.limit || 20);
        if (filter.search && filter.search !== '') {
            let exp = new RegExp(filter.search);
            query.or([{name: exp}, {sequence: filter.search}]);
        }
        if (filter.isAudit) {
            query.where('isAudit', filter.isAudit);
        }
        let count = yield VotePlayer.count(query.getQuery()).exec();
        let totalPage = Math.ceil(count / limit);
        page = Math.min(page, totalPage);
        if (page === 0) {
            return {
                total: 0,
                players: []
            };
        }
        query.skip((page - 1) * limit).limit(limit);
        if (filter.order) {
            query.sort(filter.order);
        }
        let players = yield query.lean().exec();
        return {
            total: count,
            players: players
        };
    }),

    findPlayerCount: co.wrap(function *(filter) {
        let query = VotePlayer.where({
            vote: filter.vote
        });
        if (filter.isAudit) {
            query.where('isAudit', filter.isAudit);
        }
        if (filter.search && filter.search !== '') {
            let exp = new RegExp(filter.search);
            query.or([{name: exp}, {sequence: exp}]);
        }
        return yield query.count().exec();
    }),

    auditPlayers: co.wrap(function *(players) {
        if (!_.isArray(players)) {
            players = [players];
        }
        return yield VotePlayer.update({_id: {$in: players}}, {
            isAudit: true
        }, {multi: true}).exec();
    }),

    operatePoll: co.wrap(function*(playerId, operatedPoll) {
        operatedPoll = parseInt(operatedPoll);
        if (_.isNaN(operatedPoll)) {
            throw createError(400, '票数必须为整数');
        }
        let player = yield VotePlayer.findById(playerId).select('poll').exec();
        if (!player) {
            throw createError(400, '选手不存在');
        }
        let poll = player.poll;
        player.poll = Math.max(0, poll + operatedPoll);
        return yield player.save();
    })

};