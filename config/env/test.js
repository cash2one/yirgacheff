'use strict';

module.exports = {
    db: {
        uri: 'mongodb://localhost:27017/hizuoye',
        options: {}
    },
    redis: {
        host: 'localhost',
        port: 6379,
        keyPrefix: 'hizuoye-dev',
        options: {}
    },
    app: {
        title: '360家校云开发环境',
        description: '云端作业平台',
        keywords: '在线教育'
    },
    keys: ['keys'],

    qn: {
        accessKey: 'SPJ9b_qmVxy0FQU-93J4xb5EbHv9Z4Jn_-78f8gr',
        secretKey: 'NOFnKRTsd1RjjYoyT1qPAgHyczBmAjl-s26GXpA4',
        bucket: 'yirgacheffe',
        visitUrl: 'http://7rfll3.com1.z0.glb.clouddn.com'
    },
    apiUrl: 'http://testapi.hizuoye.com',
    wxUrl: 'http://testwx.hizuoye.com',
    logDir: './log'

};
