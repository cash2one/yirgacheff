/**
 * Created by Frank on 15/12/21.
 */
'use strict';
const mongoose = require('mongoose');
const co = require('co');
const _ = require('lodash');
const Media = mongoose.model('Media');


module.exports = {


    /**
     * 批量添加媒体
     */
    createMedias: co.wrap(function*(schoolId, data) {
        let uploads = data.uploads;
        let medias = _.map(uploads, upload => {
            return {
                key: upload.key,
                name: upload.name,
                schoolId: schoolId
            }
        });
        return yield Media.create(medias);
    }),

    /**
     * 根据学校获取媒体
     */
    findBySchool: co.wrap(function*(schoolId) {
        return yield Media.find({
            schoolId: schoolId,
            state: 0
        }).lean().exec();

    }),


    /**
     * 根据ID删除媒体,支持批量删除
     */
    deleteByIds: co.wrap(function*(ids) {
        let medias = ids;
        if (!_.isArray(medias)) {
            medias = [medias];
        }
        return yield Media.where('_id')
            .in(medias)
            .setOptions({multi: true})
            .update({state: 1})
            .exec();
    })

};