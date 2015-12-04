var gulp = require('gulp');
var minify = require('gulp-minify');

gulp.task('minify', function() {
  gulp.src('pi.js')
    .pipe(minify())
    .pipe(gulp.dest('dist'));
});
gulp.task('default', ['minify']);