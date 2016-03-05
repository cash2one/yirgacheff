'use strict';

const _ = require('lodash');
const voteService = require('../../../../services').events.vote;

module.exports = function (router) {

    router.post('/:voteId([a-f0-9]{24})/votePlayer', function *() {
        let data = this.request.body;
        data.vote = this.params.voteId;
        let _id = data._id;
        if (_id && _id !== '') {
            this.body = yield voteService.updatePlayer(_id, data);
        } else {
            this.body = yield voteService.addPlayer(_.omit(data, '_id'));
        }
    });


    router.get('/:voteId([a-f0-9]{24})/votePlayer', function *() {
        let filter = _.assign({vote: this.params.voteId}, this.query);
        this.body = yield voteService.findPlayers(filter);
    });

    router.put('/votePlayer/:playerId([a-f0-9]{24})/poll', function*() {
        this.body = yield voteService.operatePoll(this.params.playerId, this.request.body.poll);
    });

    //删除报名信息
    router.delete('/votePlayer/:playerId([a-f0-9]{24})', function*() {
        this.body = yield voteService.deletePlayerById(this.params.playerId);
    });

    //审核报名信息
    router.put('/auditPlayers', function*() {
        this.body = yield voteService.auditPlayers(this.request.body.players);
    });

    return router;
};