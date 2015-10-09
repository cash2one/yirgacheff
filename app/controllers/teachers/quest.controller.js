
/**
 * 问题列表页面
 * @param req
 * @param res
 * @returns {*}
 */
exports.question = function (req, res) {
    return res.render('backend/teacher/questions/list-questions');
};

exports.questioninfo = function (req, res) {
    return res.render('backend/teacher/questions/view-quest');
};





