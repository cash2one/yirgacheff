/**
 * Created by Frank on 15/7/2.
 */
var _ = require('lodash');
var async = require('async');
var redis = require('../../../db/redis');
var models = require('../../models');
var Media = models.Media;
var MediaGroup = models.MediaGroup;
var ObjectId = require('mongoose').Types.ObjectId;

var api = exports = module.exports = {};

function makeKey(schoolId) {
    return 'school:' + schoolId + ':mediaGroup';
}


api.batchAddMedias = function (req, res, next) {
    var data = req.body;
    var uploads = data.uploads;
    var group = data.group;
    if (!group || group === '' || group === 'null' || group === 'unGroup') {
        group = null;
    }

    var medias = _.map(uploads, function (upload) {
        return {
            group: group,
            key: upload.key,
            name: upload.name,
            schoolId: req.user.schoolId
        };
    });
    Media.create(medias, function (err, medias) {
        if (err) {
            return next(err);
        }
        res.json(medias);
    });

};


/**
 * 添加媒体分组
 * @param req
 * @param res
 * @returns {*}
 */
api.addGroup = function (req, res, next) {
    var data = req.body;
    data.schoolId = req.user.schoolId;
    var group = new MediaGroup(data);
    group.save(function (err) {
        if (err) {
            return next(err);
        }
        res.json(group);
    });
};

/**
 * 修改分组信息
 * @param req
 * @param res
 */
api.modifyGroup = function (req, res, next) {
    var newName = req.body.name;
    var groupId = req.params.groupId;
    if (!newName || newName.trim() === '') {
        return next('分组名不能为空');
    }
    MediaGroup.update({_id: groupId}, {name: newName})
        .exec(function (err) {
            if (err) {
                return next(err);
            }
            return res.sendStatus(200);
        });
};

/**
 *
 * 删除分组信息
 * @param req
 * @param res
 *
 */
api.deleteGroup = function (req, res, next) {
    var groupId = req.params.groupId;
    //将位于该分组的资源分组设置‘未分组’
    Media.update({
        group: groupId
    }, {$set: {group: null}}, {multi: true}).exec(function (err) {
        if (err) {
            return next(err);
        }
        MediaGroup.remove({_id: groupId}).exec(function (err) {
            if (err) {
                return next(err);
            }
            return res.sendStatus(200);
        });
    });
};


/**
 * 获取媒体分组列表
 * @param req
 * @param res
 * @param next
 */
api.listGroup = function (req, res, next) {
    var schoolId = req.user.schoolId;
    MediaGroup.find({schoolId: schoolId}, 'name')
        .lean()
        .exec(function (err, groups) {
            if (err) {
                return next(err);
            }
            groups = groups || [];
            // 默认有一个未分组
            groups.unshift({
                name: '未分组',
                _id: 'unGroup'
            });
            return res.json(groups);
        });
};


/**
 * 列出分组中所有媒体
 * @param req
 * @param res
 */
api.listMediaByGroup = function (req, res, next) {
    var groupId = req.params.groupId || null;
    Media.find({schoolId: req.user.schoolId, group: groupId, state: 0})
        .lean()
        .exec(function (err, medias) {
            if (err) {
                return next(err);
            }
            return res.json(medias);
        });
};


/**
 *
 * 修改媒体信息
 * @param req
 * @param res
 *
 */
api.modifyMedia = function (req, res, next) {
    var newName = req.body.name;
    if (!newName || newName.trim() === '') {
        return next('图片名称不能为空');
    }
    Media.update({
        _id: req.params.mediaId
    }, {name: newName}).exec(function (err) {
        if (err) {
            return next(err);
        }
        return res.sendStatus(200);
    });
};

/**
 *
 * 修改媒体分组
 * @param req
 * @param res
 *
 */
api.changeGroup = function (req, res, next) {
    var medias = req.body.medias,
        newGroup = req.body.group,
        updates = {};
    if (!medias) {
        return next('媒体不能为空');
    }
    if (!_.isArray(medias)) {
        medias = [medias];
    }
    if (!newGroup || newGroup === 'unGroup') {
        updates.$unset = {group: ""};
    } else {
        updates = {group: newGroup};
    }
    Media.update({
        _id: {$in: medias}
    }, updates, {multi: true}).exec(function (err) {
        if (err) {
            return next(err);
        }
        return res.sendStatus(200);
    });
};


/**
 *
 * 删除媒体
 * @param req
 * @param res
 *
 */
api.deleteMedia = function (req, res, next) {
    var medias = req.body.medias;
    if (!medias) {
        return next('媒体不能为空');
    }
    if (!_.isArray(medias)) {
        medias = [medias];
    }

    var q = Media.where('_id').in(medias).setOptions({multi: true});
    q.update({state: 1}, function (err) {
        if (err) {
            return next(err);
        }
        return res.sendStatus(200);
    });
};


api.mediasCountMapper = function (req, res, next) {
    Media.aggregate()
        .match({schoolId: new ObjectId(req.user.schoolId), state: 0})
        .project({
            group: 1
        })
        .group({
            _id: '$group',
            count: {$sum: 1}
        })
        .exec(function (err, aggs) {
            if (err) {
                return next(err);
            }
            var rs = {};
            _.forEach(aggs, function (agg) {
                var _id = agg._id || 'unGroup';
                rs[_id] = agg.count;
            });
            return res.json(rs);
        });

};
