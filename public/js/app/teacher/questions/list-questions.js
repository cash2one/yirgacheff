'use strict';

requirejs(['jquery', 'leftMenu', 'headMenu','layer','easyDropDown', 'datatables'],
    function ($, leftMenu, headMenu,layer) {
        leftMenu.init();
        headMenu.init();
        //全局变量
        var status = 0;
        var allStudent;
        function getAllStudent(){
            var url = "/api/v1/teachers/"+GLOBAL.user._id+"/students";
            $.get(url,function(data){
                allStudent = data;
            });
        }
        getAllStudent();
        //格式化时间函数
        function   formatDate(date1)   {
            var   now = new Date(date1);
            var   year = now.getFullYear();
            var   month = now.getMonth()+1;
            var   date = now.getDate();
            var   hour = now.getHours();
            var   minute = now.getMinutes();
            return   year+"-"+month+"-"+date+"   "+hour+":"+minute;
        }
        var list = $('#library-list');

        var table = list.DataTable({
            'bAutoWidth': true,
            "bSort": false,
            'language': {
                'url': '/js/lib/plugins/dataTable/Chinese.lang'
            },
            'ajax': {
                url: '/api/v1/question?state=0',
                dataSrc: ''
            },
            'order': [[1, "desc"]],
            'columns': [
                {'data': 'questionText'},
                {'data': 'student.displayName'},
                {'data': 'student.username'},
                { 'data': 'createdTime'},
                {
                    'data': null,
                    'defaultContent': '<a  class="btn-small a-btn-blue w-btn-opt-large detail">查看</a>&nbsp;&nbsp;'
                }
            ],
            'columnDefs':[{
                'targets': [3],
                'render': function(data, type, row){
                    var date = (new Date(data)).getTime();
                    return formatDate(date);
                }
            }
            ]
        });

        //选择未解决的问题或已解决的问题
        $('.quest-opts-area').find('.item').each(function () {
            $(this).bind('click', function () {
                var selected = $(this).hasClass('selected');
                if (selected) {
                    return;
                }
                $(this).addClass('selected').siblings().removeClass('selected');
                status = $(this).data("id");

                table.ajax.url('/api/v1/question?state='+status).load(function(){
                    if(document.getElementById('myStudent').checked){
                        filterMyStudent();
                    }
                });
            });
        });

        //仅看我的学生
        function filterMyStudent(){
            if(!allStudent){
                getAllStudent();
            }
            var arr = [];
            for(var item in allStudent){
                arr.push(allStudent[item].username);
            }
            //找到我的学生保存在fliterData中
            var fliterData = table
                .data()
                .filter(function(value,index){
                    return $.inArray(value.student.username,arr)>-1;
                });
            //先清除数据，再将数据渲染
            table.clear().draw();
            console.log(fliterData.length);
            for(var i=0; i<fliterData.length;i++ ){
                table.row.add(fliterData[i]).draw();
            }
        }

        //勾选是否仅看我的学生
        $('.checkbox-que input').click(function(){
            if(document.getElementById('myStudent').checked){                       //选中处理
                filterMyStudent();
            }else{
                table.ajax.url('/api/v1/question?state='+status).load();
            }
        });

        //查看具体的页面
        list.on('click','.detail',function(){
            var quest = table.row($(this).parents('tr')).data();
            window.open('/teacher/question/questionInfo/' + quest._id, "_self");
        });

        //老师回答完问题保存数据
        $('.msg-save').click(function(){
            var questionResult = $('.w-que-answer').val();
            if(questionResult){
                var h = window.location.href;
                var s = h.split('/');
                //alert(questionResult);
                var data = {
                    teacherId: GLOBAL.user._id,
                    answer: questionResult,
                    questionId: s[s.length-1]
                };
                $.post("/api/v1/question",data,function(data){
                    window.open('/teacher/question',"_self");
                });
            }else{
                alert('您答案还没有呢，怎么就着急提交呢');
            }
        });


    });

