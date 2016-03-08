/**
 *
 * Created by Frank on 15/5/15.
 */
'use strict';

module.exports = {
    subTitle: function (input, length) {
        if (input && input.length > length) {
            return input.substring(0, length) + '...';
        }
        return input;
    },

    templateName: function (input) {
        if (input === 'article') {
            return '文章';
        }
        if (input === 'activity') {
            return '活动';
        }
        if (input === 'vote') {
            return '投票';
        }
        if (input === 'classroom') {
            return '在线课堂';
        }
        if (input === 'audition') {
            return '试听课';
        }
    }
};

