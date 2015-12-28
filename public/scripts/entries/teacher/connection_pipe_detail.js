'use strict';

requirejs(['jquery', 'restfulClient', 'layerWrapper', 'laypage', 'leftMenu', 'headMenu', 'pagination'],
    function ($, $http, layer, laypage, leftMenu, headMenu, pagination) {
        var studentId = $('#studentId').val();
        leftMenu.init();
        headMenu.init();
        alert(studentId);
        function makeRecord(data) {
            var timeStr = data.createdTime.substr(0, 10);
            var result = '<li>';
            result += '<div>'
                + '<div>' + timeStr.substr(0, 7) + '</div>'
                + '<div>' + timeStr.substr(8) + '</div></div>'
                + '<div>'
                + '<div>'
                + data.content
                + '</div> </div> '
                + '<div>'
                + '<div>记录人：' + GLOBAL.user.displayName + '</div></div>'
                + '</li>';
            return result;
        }

        $('#conn-rec-save').bind('click', function connRecSave() {
            var content = $('#connection-content').val().trim();
            if (content === '') {
                layer.msg('内容不能为空');
                return;
            }

            var url = '/api/v1/connections/students/' + studentId;
            $http.post(url, {content: content}, function (data) {
                var record = makeRecord(data);
                var $first = $('#record-list').find('tr:first-child');
                $(record).insertBefore($first);
                $('#connection-content').val('');
                initPaging();
                //总记录数
                var total = pagination.totalNum('record-list', 'records');
                if (total > 0) {
                    //页数
                    var pages = 0, division = 5;
                    if (total % division == 0) {
                        pages = parseInt(total / division);
                    } else {
                        pages = parseInt(total / division) + 1;
                    }
                    laypage({
                        cont: 'pagination',
                        pages: pages,
                        curr: function () {
                            return 1;
                        }()
                    });
                }
            });
        });

        //初始化
        function initPaging() {
            $('#record-list').find('li.data').each(function (index) {
                if (index > 4)$(this).hide();
            });
        }

        initPaging();

        var total = pagination.totalNum('record-list', 'records');
        if (total > 0) {
            pagination.paginate('record-list', total, 5, 'pagination');
        }
    });
