const gulp = require('gulp');
const imagemin = require('gulp-imagemin');

gulp.task('imageMin', () => {
  gulp.src('public/assets/background/*')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/assets/img'));
});