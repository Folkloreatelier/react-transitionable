'use strict';

module.exports = function(gulp, plugins)
{
    var examplesFolder = './examples';
    var assetsSrcFolder = './src';
    var assetsTmpPath = './.tmp';
    var assetsBuildFolder = './dist';
    var publicPath = [
        assetsTmpPath,
        assetsSrcFolder,
        './examples'
    ];
    
    var jsConfigPath = './webpack.config.js';
    
    var browserSyncWatchFiles = [
        examplesFolder+'/**/*.html',
        examplesFolder+'/**/*.css',
        examplesFolder+'/**/*.{gif,jpg,png}',
        assetsTmpPath+'/**/*.js'
    ];

    // Configurable paths
    return {
        
        //Javascript (Webpack)
        jsSrcPath: assetsSrcFolder,
        jsTmpPath: assetsTmpPath,
        jsBuildPath: assetsBuildFolder,
        jsConfigPath: jsConfigPath,
        
        //Public path for Browser sync
        publicPath: publicPath,
        
        //Files to watch by browser sync
        browserSyncWatchFiles: browserSyncWatchFiles,
        
        //Assets path
        assetsTmpPath: assetsTmpPath,
        assetsSrcPath: assetsSrcFolder,
        assetsBuildPath: assetsBuildFolder
    };
    
};
