/**
 * Created by Frank on 15/12/18.
 */
'use strict';

const _ = require('lodash');

let a = {name: 'mooc'};
_.defaultsDeep(a, {where: {name: 'ss', age: 23}});
console.log(a);