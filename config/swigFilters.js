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
    }

};

