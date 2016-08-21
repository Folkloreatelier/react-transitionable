'use strict';

var url = require('url');
var path = require('path');
var fs = require('fs');

module.exports = function(gulp, config, browserSync)
{
    var browserSyncConfig = {

        files: config.browserSyncWatchFiles || [],

        watchOptions: {
            ignored: false
        },

        scrollProportionally: false,
        ghostMode: false,
        notify: false,

        server: {
            baseDir: config.publicPath
        }
    };

    // Static Server + watching scss/html files
    return function() {

        browserSync.init(browserSyncConfig);

    };

};
