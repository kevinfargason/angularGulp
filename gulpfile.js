// gulp
var gulp = require('gulp');
var debug = require('gulp-debug');
var config = require('./gulp.config.json');

// plugins
var connect = require('gulp-connect');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var minifyCSS = require('gulp-minify-css');
var clean = require('gulp-clean');
var rename = require('gulp-rename');

// tasks
gulp.task('lint', function() {
  gulp.src([config.src.js, '!./app/bower_components/**'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'));
});
gulp.task('clean', function() {
    return gulp.src('./dist/**/*', {read: false})
      .pipe(clean({force: true}));
});
gulp.task('sass', function(callback){
     return gulp.src([config.src.sass + '/app.scss'])
    .pipe(debug())
    .pipe(sass())
    .pipe(gulp.dest('./dist/css/'));
});

gulp.task('app-css', ['sass'],function() {
  var opts = {comments:true,spare:true};
  gulp.src([config.dist.css + '/*'])
    .pipe(minifyCSS(opts))
    .pipe(rename('app.min.css'))
    .pipe(gulp.dest(config.dist.css))
});
gulp.task('lib-css', ['sass'],function() {
  var opts = {comments:true,spare:true};
  gulp.src([config.dist.css + '/*'])
    .pipe(minifyCSS(opts))
    .pipe(rename('lib.min.css'))
    .pipe(gulp.dest(config.dist.css))
});

gulp.task('minify-js', function() {
  gulp.src(['./app/**/*.js', '!./app/bower_components/**'])
    .pipe(uglify({
      // inSourceMap:
      // outSourceMap: "app.js.map"
    }))
    .pipe(gulp.dest('./dist/'))
});
gulp.task('copy-bower-components', function () {
  gulp.src('./app/bower_components/**')
    .pipe(gulp.dest('dist/bower_components'));
});
gulp.task('copy-html-files', function () {
  gulp.src('./app/**/*.html')
    .pipe(gulp.dest('dist/'));
});
gulp.task('connect', function () {
  connect.server({
    root: 'app/',
    port: 8888
  });
});
gulp.task('connectDist', function () {
  connect.server({
    root: 'dist/',
    port: 9999
  });
});

gulp.task('debug', function () {
    return gulp.src('./app/sass/_payload.scss')
        .pipe(debug({title: 'unicorn:'}))
        .pipe(gulp.dest('dist'));
});


// default task
gulp.task('default',
  ['build']
);

//run the app
gulp.task('run', ['connectDist']);

// build task
gulp.task('build',
  [ 'lint', 'app-css', 'lib-css','minify-js', 'copy-html-files', 'copy-bower-components']
);