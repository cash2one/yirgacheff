/**
 * Created by Frank on 15/11/28.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const Router = require('koa-router');
const _ = require('lodash');


module.exports = function (opts) {
    let options = opts || {};
    let directory = options.directory || 'routes';
    let state = fs.statSync(directory);
    if (!state.isDirectory()) {
        throw new Error(`${directory} is not a directory`);
    }
    return walkRouter(new Router(), directory).routes();
};


/**
 * 递归注册路由
 * @param rootRouter
 * @param directory
 * @returns {*}
 */
function walkRouter(rootRouter, directory) {
    let files = fs.readdirSync(directory);
    let indexFile = files.filter(file => file === 'index.js');

    //每个目录单独一个路由实例
    let indexRouter = new Router();
    if (indexFile.length > 0) {
        // 如果存在 index.js 文件,
        registerRouter(path.resolve(directory, 'index.js'), indexRouter);
    }

    files.filter(file => file !== 'index.js')
        .forEach(file => {
            let router = new Router();
            let filePath = path.resolve(directory, file);
            let prefix = '';
            if (path.extname(file) === '.js') {
                prefix = path.basename(file, '.js');
                if (prefix !== '') {
                    router.prefix('/' + prefix);
                }
                router = registerRouter(filePath, router);
                indexRouter.use(router.routes());
            } else {
                //如果是文件夹,递归调用
                if (fs.statSync(filePath).isDirectory()) {
                    router.prefix('/' + file);
                    indexRouter.use('', walkRouter(router, filePath).routes());
                }
            }
        });
    return rootRouter.use(indexRouter.routes());
}


function registerRouter(filePath, router) {

    let handler = require(filePath);

    if (isGenerator(handler)) {
        return router.use('/*', handler);
    }

    if ('function' === typeof handler) {
        return handler(router) || router;
    }

    if (_.isArray(handler)) {
        // 如果返回的是数组,数组元素只允许是generator, 用于同时注册多个中间件
        let middleware = [];
        _.forEach(handler, h=> {
            if (isGenerator(h)) {
                return middleware.push(h);
            } else {
                console.error('handler type of array only allow generator : ', filePath)
            }
        });
        return router.use('/*', ...middleware);
    }
    console.warn('UnSupported handler type : ', filePath);
    return router;
}

function isGenerator(fun) {
    if (!fun || !_.isFunction(fun)) {
        return false;
    }
    return 'GeneratorFunction' === fun.constructor.name;
}





