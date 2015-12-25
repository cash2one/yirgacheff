/**
 * Created by Administrator on 2015/12/25.
 */
'use strict'


var highchartsWrapper = function(){
    window.Highcharts = require('highcharts');
    require('highcharts-themes/dist/highcharts-themes');
}
module.exports = highchartsWrapper();