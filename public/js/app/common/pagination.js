'use strict';

define(['jquery','laypage'], function ($, laypage) {


    /**
     * element ul的dom结构id
     * displayNum  显示totalNum的dom结构id
     * */
    var totalNum = function(element, displayNum){
        //总记录数
        var total = 0;
        total = $('#' + element).find('li.data').size();
        $('#' + displayNum).text(total);
        return total;
    }

    /**
     * element ul的dom结构id
     * displayNum  显示totalNum的dom结构id
     * */
    var totalNumExt = function(element, displayNum, state){
        //总记录数
        var total = 0;
        if(state === ''){
            total = $('#' + element).find('li.data').size();
        }else{
            $('#' + element).find('li.data').each(function () {
                var _state = $(this).attr('data-state');
                if(state === _state){
                    total += 1;
                }
            });
        }
        $('#' + displayNum).text(total);
        return total;
    }

    /**
     * elementName ul的dom结构id
     * total  列表总的记录数
     * division 每页显示的数目
     * pagerName 分页要放入的dom结构id
     *
     * */
    var paginate = function (elementName, total, division, pagerName) {

        var pages = 0;
        if (total % division == 0) {
            pages = parseInt(total / division);
        } else {
            pages = parseInt(total / division) + 1;
        }

        laypage({
            cont: pagerName,
            pages: pages,
            curr: function(){ //初始化当前页
                var page = location.search.match(/page=(\d+)/);
                return page ? page[1] : 1;
            }(),
            jump: function(e, first){
                if(!first){ //一定要加此判断，否则初始时会无限刷新
                    var _indexs = [];
                    //生成
                    for (var i = 0; i < division; i++) {
                        _indexs[i] = 0;
                    }

                    for (var j = 0; j < _indexs.length; j++) {
                        if(j == 0){
                            _indexs[j] = (e.curr - 1) * division;
                        }else{
                            _indexs[j] = _indexs[j-1] + 1;
                        }
                    }

                    var size = $('#' + elementName).find('li.data').size();
                    var elem = '';
                    if(size > 0){
                        elem = 'li.data';
                    }else{
                        elem = 'li';
                    }

                    $('#' + elementName).find(elem).each(function(index){
                        for (var m = 0; m < _indexs.length; m++) {
                            if(index === _indexs[m]){
                                $(this).show();
                                break;
                            }else{
                                $(this).hide();
                            }
                        }
                    });

                }
            }
        });
    };
    var paginateExt = function (elementName, total, division, pagerName, state) {

        var pages = 0;
        if (total % division == 0) {
            pages = parseInt(total / division);
        } else {
            pages = parseInt(total / division) + 1;
        }

        laypage({
            cont: pagerName,
            pages: pages,
            curr: function(){ //初始化当前页
                var page = location.search.match(/page=(\d+)/);
                return page ? page[1] : 1;
            }(),
            jump: function(e, first){
                if(!first){ //一定要加此判断，否则初始时会无限刷新
                    var size = 0;
                    $('#' + elementName).find('li.data').each(function(){
                        var display = $(this).attr('data-state');
                        if(display === state){
                            size += 1;
                        }
                    });
                    var elem = '';
                    if(size > 0){
                        elem = 'li.data';
                    }else{
                        elem = 'li';
                    }
                    var counter = 0;
                    $('#' + elementName).find(elem).each(function () {
                        if (counter > 9) {
                            return;
                        }
                        var status = $(this).attr('data-state');
                        if (status === state) {
                            var view = $(this).is(':hidden');
                            if (view) {
                                $(this).show();
                            } else {
                                $(this).hide();
                            }
                        }
                        counter++;
                    });
                }
            }
        });
    };
    return {
        totalNum:totalNum,
        totalNumExt:totalNumExt,
        paginate: paginate,
        paginateExt:paginateExt
    };
});