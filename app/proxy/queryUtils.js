/**
 * Created by Frank on 15/4/14.
 *
 * 查询工具函数
 *
 */

'use strict';
var _ = require('lodash');

/**
 * 设置populate域
 * @param query
 * @param populates
 * @returns {*}
 */
var setPopulate = function (query, populates) {
    if (query && populates) {
        // 设置populate域
        _.forEach(populates, function (populate) {
            if (populate.select) {
                query.populate(populate.path, populate.select);
            } else {
                query.populate(populate.path);
            }
        });
    }
    return query;
};


/**
 * 设置limit
 * @param query
 * @param limit
 * @returns {*}
 */
var setLimit = function (query, limit) {
    if (query && _.isNumber(limit)) {
        query.limit(limit);
    }
    return query;
};

/**
 * 设置offset
 * @param query
 * @param offset
 * @returns {*}
 */
var setOffset = function (query, offset) {
    // 设置limit
    if (query && _.isNumber(offset)) {
        query.skip(offset);
    }
    return query;
};

/**
 * 设置offset
 * @param query
 * @param sort
 * @returns {*}
 */
var setSort = function (query, sort) {
    // 设置 sort
    if (query && _.isString(sort)) {
        sort = sort.replace(/,/g, ' ');
        query.sort(sort);
    }
    return query;
};

/**
 * 设置select过滤
 * @param query
 * @param fields
 */
var setSelect = function (query, fields) {
// 设置fields过滤
    if (query && _.isString(fields)) {
        fields = fields.replace(/,/g, ' ');
        query.select(fields);
    }
    return query;
};

/**
 * 设置过滤条件
 * @param query
 * @param filters
 * @returns {*}
 */
var setFilter = function (query, filters) {
    if (query && !_.isEmpty(filters)) {
        _.forOwn(filters, function (value, field) {
            query.where(field, value);
        });
    }
    return query;
};


var setLean = function (query, lean) {
    if (lean) {
        query.lean();
    }
    return query;
};

var set$In = function (query, $in) {
    if ($in) {
        query.where($in.field).in($in.values);
    }
};

/**
 * 设置查询条件
 * 目前支持  limit 、offset、sort、populate
 * @param query
 * @param conditions
 * @returns {*}
 */
exports.makeQuery = function (query, conditions) {
    conditions = conditions || {};
    delete conditions._;  // 去掉请求url中的版本值
    if (_.isEmpty(conditions)) {
        return query;
    }
    // 设置limit
    setLimit(query, conditions.limit);
    // 设置offset
    setOffset(query, conditions.offset);
    // 设置sort
    setSort(query, conditions.sort);
    // 设置select
    setSelect(query, conditions.fields);
    // 设置populate域
    setPopulate(query, conditions.populate);
    // 设置lean
    setLean(query, conditions.lean);
    // 设置$in查询
    setLean(query, conditions.$in);
    // 设置属性过滤
    var filters = _.omit(conditions, 'limit', 'offset', 'fields', 'sort', 'populate', 'lean', '$in');
    setFilter(query, filters);
    return query;
};
