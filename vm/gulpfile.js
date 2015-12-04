var gulp = require('gulp');
var minify = require('gulp-minify');


gulp.task('minify', function() {
  gulp.src('vm.js')
    .pipe(minify())
    .pipe(gulp.dest('dist'));
});
gulp.task('default', ['minify']);