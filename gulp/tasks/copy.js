'use strict';

module.exports = function(gulp, config)
{
    return function() {
        return gulp.src(config.jsTmpPath+'/react-draw.js')
                .pipe(gulp.dest(config.jsBuildPath));
    };
};
