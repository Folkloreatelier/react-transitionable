'use strict';
var path = require('path');
var _ = require('lodash');

//Load configuration from environment file
require('dotenv').config({
    path: path.join(__dirname, '.env'),
    silent: true
});

/**
 * Gulp
 */
var gulpPath = path.resolve('./gulp');
var gulp = require('gulp');
var config = require(path.join(gulpPath,'config'))(gulp);

/**
 * Browsersync
 */
gulp.browserSync = require('browser-sync').create();
gulp.task('browsersync', require(path.join(gulpPath,'tasks/browsersync'))(gulp, config, gulp.browserSync));
gulp.task('browsersync-reload', function()
{
    return gulp.browserSync.reload();
});

/**
 * Webpack
 */

var configExamples = _.merge({}, config, {
    jsSrcPath: './examples/js',
    jsTmpPath: './.tmp/js',
    jsConfigPath: './build/webpack.config.examples.js'
});
gulp.task('webpack', require(path.join(gulpPath,'tasks/webpack'))(gulp, config));
gulp.task('webpack-examples', require(path.join(gulpPath,'tasks/webpack'))(gulp, configExamples, true));
gulp.task('scripts', ['webpack'], require(path.join(gulpPath,'tasks/scripts'))(gulp, config));

/**
 * Copy
 */
gulp.task('copy', ['webpack'], require(path.join(gulpPath,'tasks/copy'))(gulp, config));

/**
 * Other
 */
gulp.task('server', [
    'webpack-examples',
    'browsersync'
]);

gulp.task('build', [
    'scripts',
    'copy'
]);

gulp.task('default', ['build']);
