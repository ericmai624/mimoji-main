const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const base64 = require('gulp-base64');
const cleanCSS = require('gulp-clean-css');

gulp.task('imageMin', () => {
  gulp.src('public/assets/background/*')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/assets/img'));
});

gulp.task('css', () => {
  return gulp.src('./src/index.css')
    .pipe(base64({
      baseDir: './public',
      maxImageSize: 20 * 1024 * 1024,
    }))
    .pipe(cleanCSS())
    .pipe(gulp.dest('./public/assets/css'));
});