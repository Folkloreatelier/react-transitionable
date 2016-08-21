'use strict';

var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

module.exports = function(gulp, config)
{
    return function() {
        return gulp.src(config.jsTmpPath+'/react-draw.js')
                .pipe(uglify())
                .pipe(rename({
                    extname: '.min.js'
                }))
                .pipe(gulp.dest(config.jsBuildPath));
    };
};
