/**
 * Created by Frank on 15/7/2.
 */
var media = require('../../api/v1/media.api');

module.exports = function (api) {

    api.get('/mediaGroups', media.listGroup);

    api.post('/mediaGroups', media.addGroup);

    api.put('/mediaGroups/:groupId([a-f0-9]{24})', media.modifyGroup);

    api.delete('/mediaGroups/:groupId([a-f0-9]{24})', media.deleteGroup);

    api.get('/mediaGroups/:groupId([a-f0-9]{24})/medias', media.listMediaByGroup);

    api.get('/mediaGroups/unGroup/medias', media.listMediaByGroup);

    api.delete('/medias', media.deleteMedia);

    api.post('/medias', media.batchAddMedias);

    api.put('/medias/:mediaId([a-f0-9]{24})', media.modifyMedia);

    api.put('/medias/changeGroup', media.changeGroup);

    api.get('/mediaGroups/medias/count', media.mediasCountMapper);

};
