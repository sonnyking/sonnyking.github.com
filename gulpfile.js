var gulp = require('gulp');

// Include Our Plugins
var del = require('del');
var bower = require('gulp-bower');
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var ts = require('gulp-typescript');
var merge = require('merge2');
var jade = require('gulp-jade');
var browserSync = require('browser-sync').create();
require('web-component-tester').gulp.init(gulp);

// clean the distro
gulp.task('clean-dist', function (cb) {
  del(['dist'], cb);
});

// bower install
gulp.task('bower', function() {
  return bower()
});

// Lint Task
gulp.task('lint', function() {
    return gulp.src('src/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Compile Our Sass
gulp.task('sass', function() {
    return gulp.src('src/scss/*.scss')
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('dist/css'));
});

gulp.task('scripts', function() {
  var tsResult = gulp.src('src/**/*.ts')
    .pipe(ts({
        declarationFiles: true,
        noExternalResolve: true
      }));

  return merge([
    tsResult.dts.pipe(gulp.dest('dist/definitions')),
    tsResult.js.pipe(gulp.dest('dist/js'))
    ]);
});

gulp.task('assets', function() {
  return gulp.src('src/images/**/*')
  .pipe(gulp.dest('dist/images'))
});

gulp.task('templates', function() {
  var YOUR_LOCALS = {};

  gulp.src('src/jade/*.jade')
    .pipe(jade({
      locals: YOUR_LOCALS,
      pretty: true
    }))
    .pipe(gulp.dest('dist/'))
});

gulp.task('compile-app-tests', function() {
  var YOUR_LOCALS = {};

  gulp.src('test/**/*.jade')
    .pipe(jade({
      locals: YOUR_LOCALS,
      pretty: true
    }))
    .pipe(gulp.dest('test/'))
});

// compiles our web components, may move to seperate repos
// install them as if they we're bowered already
gulp.task('components', function() {
    var YOUR_LOCALS = {};
    gulp.src('src/components/**/*.jade')
      .pipe(jade({
        locals: YOUR_LOCALS,
        pretty: true
      }))
      .pipe(gulp.dest('dist/bower_components/'));
    gulp.src('src/components/**/*.scss')
      .pipe(sass())
      .pipe(gulp.dest('dist/bower_components/'));
});

// Watch Files For Changes
gulp.task('watch', function() {
    browserSync.init({
        server: {
            baseDir: "./dist"
        }
    });
    gulp.watch('src/images/**/*', ['assets']);
    gulp.watch('src/js/*.js', ['lint', 'scripts']);
    gulp.watch('src/scss/*.scss', ['sass']);
    gulp.watch('src/jade/*.jade', ['templates']);
    gulp.watch('test/**/*.jade', ['compile-app-tests']);
    gulp.watch(['src/components/**/*.jade','src/components/**/*.scss'], ['components']);
    gulp.watch(['dist/**/*.html', 'dist/**/*.css']).on('change', browserSync.reload);
});

// Default Task
gulp.task('default', ['lint', 'sass', 'scripts', 'templates', 'compile-app-tests', 'components', 'watch']);
gulp.task('clean', ['clean-dist'], function() {
    bower();
});
