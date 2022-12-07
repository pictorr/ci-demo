// Sass configuration
var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('sass', function(cb) {
  gulp
    .src('./public/*.scss')
    .pipe(sass())
    .pipe(
      gulp.dest(function(f) {
        return f.base;
      })
    );
  cb();
});

gulp.task(
  'default',
  gulp.series('sass', function(cb) {
    gulp.watch('./public/*.scss', gulp.series('sass'));
    gulp.watch('./src/css', gulp.series('sass'));
    cb();
  })
);