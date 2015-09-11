/**
 * Created by Frank on 15/5/6.
 */
'use strict';
var schoolMenus = require('../../common/menus').schoolMenus;

/**
 * 首页
 * @param req
 * @param res
 * @returns {*}
 */
exports.index = function (req, res) {
    return res.render('backend/school/home',
        schoolMenus.home);
};


/**
 * 个人中心
 * @param req
 * @param res
 * @returns {*}
 */
exports.profile = function (req, res) {
    return res.render('backend/school/profile');
};

/**
 * 二维码
 * @param req
 * @param res
 * @returns {*}
 */
exports.qrcode = function (req, res) {
    return res.render('backend/school/qrcode', {qrcode:req.qrcode});
};
