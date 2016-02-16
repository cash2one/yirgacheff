/**
 * Created by Frank on 15/12/20.
 */
'use strict';
const qn = require('qiniu');
const _ = require('lodash');
const config = require('../../config/config');
const DEFAULT_LIMIT = 1024 * 1024 * 5;

qn.conf.ACCESS_KEY = config.qn.accessKey;
qn.conf.SECRET_KEY = config.qn.secretKey;


/**
 * 生成token
 * @param policy
 * @returns {boolean}
 */
function generateToken(policy) {
    if (typeof policy !== 'object') {
        return false;
    }
    policy = _.assign({
        scope: config.qn.bucket
    }, policy);
    var putPolicy = new qn.rs.PutPolicy2(policy);
    return putPolicy.token();
}


module.exports = {

    imageToken: function*(next) {
        let policy = {
            fsizeLimit: 1024 * 1024 * 5,  //2M
            mimeLimit: 'image/*',
            saveKey: '$(x:schoolId)/$(etag)$(ext)'
        };
        let resultToken = generateToken(policy);
        this.state.imageToken = resultToken;
        this.token = resultToken;
        yield next;
    },


    audioToken: function*(next) {
        var policy = {
            fsizeLimit: 1024 * 1024 * 5,  //最多5M
            saveKey: '$(x:schoolId)/$(etag)$(ext)'
        };
        let resultToken = generateToken(policy);
        this.token = resultToken;
        this.state.audioToken = resultToken;
        yield next;
    },

    token: function (opts) {
        opts = opts || {};
        let limit = opts.limit || DEFAULT_LIMIT;
        let mimeLimit = opts.mimeLimit;
        return function*(next) {
            let policy = {
                fsizeLimit: limit,  //10M
                saveKey: '$(etag)$(ext)'
            };
            if (mimeLimit) {
                policy.mimeLimit = mimeLimit;
            }
            this.token = generateToken(policy);
            yield next;
        }
    }
};
