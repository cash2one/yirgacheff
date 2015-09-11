/**
 * Created by Frank on 15/7/8.
 */
var site = require('../../api/v1/site.api');
module.exports = function (api) {

    //创建文章分类
    api.post('/categories', site.createCategory);

    //修改文章分类
    api.put('/categories/:categoryId', site.modifyCategory);

    //文章分类列表
    api.get('/categories', site.listCategories);

    //删除文章分类
    api.delete('/categories/:categoryId', site.deleteCategory);

    //列出分类下所有文章
    api.get('/categories/:categoryId/posts', site.listPostsByCategoryId);

    //在指定分类下建立文章
    api.post('/categories/:categoryId/posts', site.createPost);

    //读取指定文章
    api.get('/posts/:postId', site.readPost);

    //修改指定文章
    api.put('/posts/:postId', site.modifyPost);

    //删除指定文章
    api.delete('/posts/:postId', site.deletePost);

};
