/**
 * Created by Frank on 15/7/8.
 */

var _ = require('lodash');
var async = require('async');
var models = require('../../models');
var Category = models.Category;
var Post = models.Post;

var api = exports = module.exports = {};

/**
 * 创建文章分类
 * @param req
 * @param res
 */
api.createCategory = function (req, res, next) {
    var schoolId = req.user.schoolId;
    Category.count({schoolId: schoolId}, function (err, count) {
        if (err || count > 10) {
            return next(err || '分类数量到达上限');
        }
        var category = new Category(_.assign(req.body, {schoolId: schoolId}));
        if (!category.name || category.name.trim() === '') {
            return next('分类名称不能为空');
        }
        category.save(function (err) {
            if (err) {
                return next(err);
            }
            res.json(category);
        });
    });
};

/**
 * 修改文章分类
 * @param req
 * @param res
 * @returns {*}
 */
api.modifyCategory = function (req, res, next) {
    var updateData = req.body;
    if (!updateData.name || updateData.name.trim() === '') {
        return next('分类名称不能为空');
    }
    var regx = /^[1-9]+\d*$/;
    if (!regx.test(updateData.order)) {
        return next('序号必须为数字');
    }
    Category.findByIdAndUpdate(req.params.categoryId, updateData,
        {new: true})
        .exec(function (err, category) {
            if (err) {
                return next(err);
            }
            res.json(category);
        });
};


/**
 * 列出所有文章分类
 * @param req
 * @param res
 */
api.listCategories = function (req, res, next) {
    var schoolId = req.user.schoolId;
    Category.find({schoolId: schoolId})
        .lean()
        .exec(function (err, categories) {
            if (err) {
                return next(err);
            }
            async.each(categories, function (category, callback) {
                Post.count({category: category._id}, function (err, count) {
                    if (err) {
                        return callback(err);
                    }
                    category.postCount = count;
                    callback();
                });
            }, function (err) {
                if (err) {
                    return next(err);
                }
                res.json(categories);
            });
        });
};

/**
 * 删除文章分类
 * @param req
 * @param res
 */
api.deleteCategory = function (req, res, next) {
    var categoryId = req.params.categoryId;
    Post.count({category: categoryId}, function (err, count) {
        if (err) {
            return next(res, err);
        }
        if (count > 0) {
            return next('当前分类还存在文章，暂时无法删除');
        }
        Category.remove({_id: categoryId}).exec(function (err) {
            if (err) {
                return next(err);
            }
            res.sendStatus(200);
        });
    });

};

/**
 * //列出分类下所有文章
 * @param req
 * @param res
 */
api.listPostsByCategoryId = function (req, res, next) {
    Post.find({
        category: req.params.categoryId
    }).select('-content')
        .lean()
        .exec(function (err, posts) {
            if (err) {
                return next(err);
            }
            res.json(posts);
        });
};

/**
 * 在指定分类下建立文章
 * @param req
 * @param res
 */
api.createPost = function (req, res, next) {
    var post = new Post(_.assign(req.body, {
        schoolId: req.user.schoolId,
        category: req.params.categoryId
    }));
    post.save(function (err) {
        if (err) {
            return next(err);
        }
        Category.update({_id: post.category}, {$inc: {postCount: 1}}).exec();
        res.json(post);
    });
};

/**
 *
 * 读取指定文章
 * @param req
 * @param res
 *
 */
api.readPost = function (req, res, next) {
    Post.findById(req.params.postId, function (err, post) {
        if (err || !post) {
            return next(err || '该文章不存在或已删除');
        }
        res.json(post);
    });

};

/**
 * 修改指定文章
 * @param req
 * @param res
 */
api.modifyPost = function (req, res, next) {
    Post.findByIdAndUpdate(req.params.postId, req.body, {new: true})
        .exec(function (err, post) {
            if (err) {
                return next(err);
            }
            res.json(post);
        });
};


/**
 * 删除指定文章
 * @param req
 * @param res
 */
api.deletePost = function (req, res, next) {
    Post.findById(req.params.postId, 'category').exec(function (err, post) {
        if (err || !post) {
            return next(err || '文章不存在');
        }
        post.remove(function (err) {
            if (err) {
                return next(err);
            }
            Category.update({_id: post.category}, {$inc: {postCount: -1}}).exec();
            return res.sendStatus(200);
        });
    });
};
