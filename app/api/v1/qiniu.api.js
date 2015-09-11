/**
 *
 * Created by Frank on 15/8/5.
 */


exports.imageToken = function (req, res) {
    console.log('xxxx');
    res.json({
        uptoken: req.token
    });
};

exports.audioToken = function (req, res) {
    res.json({
        uptoken: req.token
    });
};

