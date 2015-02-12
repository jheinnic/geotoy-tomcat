var gulp  = require('gulp');
var gutil = require('gulp-util');
    
gulp.task('default', function() {
    var bower = require('main-bower-files');
    var bowerNormalizer = require('gulp-bower-normalize');
    return gulp.src(bower(), {base: './bower_components'})
        .pipe(bowerNormalizer({bowerJson: './bower.json'}))
        .pipe(gulp.dest('../webapp/vendor/'))
});
