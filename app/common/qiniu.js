/**
 * Created by Frank on 15/7/22.
 */

var qn = require('qiniu'),
    _ = require('lodash'),
    config = require('../../config/config');

qn.conf.ACCESS_KEY = config.qn.accessKey;
qn.conf.SECRET_KEY = config.qn.secretKey;

/**
 * 生成token
 * @param policy
 * @returns {boolean}
 */
function token(policy) {
    if (typeof policy !== 'object') {
        return false;
    }
    policy = _.assign({
        scope: config.qn.bucket
    }, policy);
    var putPolicy = new qn.rs.PutPolicy2(policy);
    return putPolicy.token();
}


function del(key, callback) {
    var client = new qn.rs.Client();
    client.remove(config.qn.bucket, key, callback);
}


function upload(token, file, callback) {
    var extra = new qn.io.PutExtra();
    extra.mimeType = file.mimeType;
    qn.io.put(token, file.key, file.data, extra, callback);
}


module.exports = {
    generateToken: token,
    upload: upload,
    deleteByKey: del
};
