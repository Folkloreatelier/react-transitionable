'use strict';

var path = require('path');
var webpack = require('webpack-stream');
var plumber = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps');

module.exports = function(gulp, config, watch)
{
    if(typeof(watch) === 'undefined')
    {
        watch = false;
    }
    
    config.watch = watch;
    
    var defaultConfig;
    try {
        var configPath = path.resolve(config.jsConfigPath);
        defaultConfig = require(configPath)(config);
    } catch(e) {
        defaultConfig = {};
    }
    
    if(process.env.NODE_ENV !== 'production')
    {
        defaultConfig.devtool = 'source-map';
        defaultConfig.debug = true;
    }
    if(watch)
    {
        defaultConfig.watch = true;
    }
    
    return function()
    {
        return gulp.src(path.join(config.jsSrcPath,'/index.js'))
            .pipe(plumber())
            .pipe(sourcemaps.init({loadMaps: true}))
            .pipe(webpack(defaultConfig))
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest(config.jsTmpPath));
    };
};
