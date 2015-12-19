/**
 * Created by Frank on 15/12/19.
 */
'use strict';
const _ = require('lodash');
const mongoose = require('mongoose');
const Query = mongoose.Query;


module.exports = function (query, filter) {
    if (_.isEmpty(filter)) {
        return query;
    }
    where(query, filter.where);
    include(query, filter.where);
    order(query, filter.order);
    fields(query, filter.fields);
    limit(query, filter.limit);
    skip(query, filter.skip);
    return query;
};


function where(query, where) {
    if (_.isEmpty(where)) {
        return query;
    }
    _.forOwn(where, (value, key)=> {
        if (_.isObject(value)) {
            let opt = Object.keys(value)[0];
            Query.prototype[opt].call(query, value[opt]);
        } else {
            query.where(key, value);
        }
    });
    return query;
}

function fields(query, fields) {
    if (_.isEmpty(fields)) {
        return query;
    }
    query.select(fields.join(' '));
    return query;
}

function include(query, include) {
    if (_.isEmpty(include)) {
        return query;
    }
    return query;
}

function order(query, order) {
    if (_.isEmpty(order)) {
        return query;
    }
    return query;
}

function limit(query, limit) {
    if (_.isEmpty(limit)) {
        return query;
    }
    query.limit(limit);
    return query;
}

function skip(query, skip) {
    if (_.isEmpty(skip)) {
        return query;
    }
    query.skip(skip);
    return query;
}

