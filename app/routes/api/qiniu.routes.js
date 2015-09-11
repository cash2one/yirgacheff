/**
 *
 * Created by Frank on 15/8/5.
 */

var qn = require('../../api/v1/qiniu.api');
var qnMid = require('../../middlewares/qn');

module.exports = function (api) {
    api.get('/imageToken', qnMid.imageToken, qn.imageToken);
    api.get('/audioToken', qnMid.audioToken, qn.audioToken);

};

