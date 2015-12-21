/**
 * Created by Frank on 15/12/21.
 */
'use strict';
const mongoose = require('mongoose');
const co = require('co');
const _ = require('lodash');
const MediaGroup = mongoose.model('MediaGroup');
const Media = mongoose.model('Media');


module.exports = {

    /**
     * 列出媒体分组
     */
    findGroupBySchool: co.wrap(function*(schoolId) {
        let groups = yield MediaGroup.find({
            schoolId: schoolId
        });
        groups = [{name: '未分组', _id: 'unGroup'}, ...groups];
        return groups;
    }),

    /**
     * 创建媒体分组
     */
    createGroup: co.wrap(function*(schoolId, data) {
        let group = new MediaGroup(data);
        data.schoolId = schoolId;
        return yield group.save();

    }),

    /**
     * 修改媒体分组
     */
    updateGroupById: co.wrap(function*(id, data) {
        let group = yield MediaGroup.findById(id).exec();
        _.assign(group, data);
        return group.save();
    }),

    /**
     * 删除媒体分组
     */
    deleteGroupById: co.wrap(function*(id) {
        let group = yield MediaGroup.findById(id).select('_id').exec();
        if (!group) {
            throw createError(400, '资源分组不存在');
        }
        //首先将该组下的所有文件设置为未分组
        yield Media.update({group: group},
            {$set: {group: null}},
            {multi: true})
            .exec();

        return yield group.remove();

    }),

    /**
     * 批量添加媒体
     */
    createMedias: co.wrap(function*(schoolId, data) {
        let group = data.group;
        let uploads = data.uploads;
        if (!group || '' === group || null === group || group === 'unGroup') {
            group = null;
        }
        let medias = _.map(uploads, upload => {
            return {
                group: group,
                key: upload.key,
                name: upload.name,
                schoolId: schoolId
            }
        });
        return yield Media.create(medias);
    }),

    /**
     * 根据媒体分组查询媒体列表
     */
    findMediaByGroupId: co.wrap(function*(id) {
        let group = id || null;
        return yield Media.find({
            group: group,
            state: 0
        }).lean().exec();

    }),

    /**
     * 更新媒体信息
     */
    updateMediaById: co.wrap(function*(id, data) {
        let media = yield Media.findById(id).exec();
        _.assign(media, data);
        return yield media.save();
    }),

    /**
     * 根据ID删除媒体,支持批量删除
     */
    deleteMediaByIds: co.wrap(function*(ids) {
        let medias = ids;
        if (!_.isArray(medias)) {
            medias = [medias];
        }
        return yield Media.where('_id')
            .in(medias)
            .setOptions({multi: true})
            .update({state: 1})
            .exec();
    }),

    /**
     * 媒体重新分组
     */
    changeGroup: co.wrap(function*(ids, group) {
        let medias = ids;
        let newGroup = group;
        let update = {};
        if (!_.isArray(medias)) {
            medias = [medias];
        }
        if (!newGroup || newGroup === 'unGroup') {
            update.$unset = {group: ""};
        } else {
            update.group = newGroup;
        }
        return yield Media.where('_id')
            .in(medias)
            .setOptions({multi: true})
            .update(update)
            .exec();

    }),

    /**
     * 媒体分组数量映照表
     */
    mediasCountMapper: co.wrap(function*(school) {
        let schoolId = new mongoose.Types.ObjectId(schoolId);
        let aggregate = yield Media.aggregate()
            .match({schoolId: schoolId})
            .project({
                group: 1
            }).exec();
        let mapper = {};
        _.forEach(aggregate, agg=> {
            let id = agg._id || 'unGroup';
            mapper[id] = agg.count;
        });
        return mapper;
    })


};