/**
 * Module Dependencies
 */

var gulp = require('gulp');
var jshint = require('gulp-jshint');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var nodemon = require('gulp-nodemon');
var connect = require('gulp-connect');
var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-minify-css');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var runSequence = require('run-sequence');
var less = require('gulp-less');


/**
 * Config
 */

var paths = {
  CssStyles: [
    './src/client/styles/css/*.css',
  ],
  lessStyles: [
    './src/client/styles/less/*.less',
  ],
  scripts: [
    './src/client/js/**/*.js',
    './src/client/js/*.js',
  ],
  server: [
    './src/server/bin/www'
  ],
  distServer: [
    './dist/server/bin/www'
  ]
};

var nodemonConfig = {
  script: paths.server,
  ext: 'html js css less',
  ignore: ['node_modules']
};

var nodemonDistConfig = {
  script: paths.distServer,
  ext: 'html js css less',
  ignore: ['node_modules']
};


/**
 * Gulp Tasks
 */

gulp.task('lint', function() {
  return gulp.src(paths.scripts)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('browser-sync', ['nodemon'], function(done) {
  browserSync({
    proxy: "localhost:3000",  // local node app address
    port: 5000,  // use *different* port than above
    notify: true
  }, done);
});

gulp.task('nodemon', function (cb) {
  var called = false;
  return nodemon(nodemonConfig)
  .on('start', function () {
    if (!called) {
      called = true;
      cb();
    }
  })
  .on('restart', function () {
    setTimeout(function () {
      reload({ stream: false });
    }, 1000);
  });
});


gulp.task('clean', function() {
  gulp.src('./dist/*')
    .pipe(clean({force: true}));
});

gulp.task('clean-css', function() {
  gulp.src('./src/client/styles/css/*.css')
    .pipe(clean({force: true}));
});

/* Task to compile less */
// gulp.task('compile-less', function() {
//   gulp.src(paths.styles)
//     .pipe(less())
//     .pipe(gulp.dest('./dist/client/less/'));
// });
// // /* Task to watch less changes */
// gulp.task('watch-less', function() {
//   gulp.watch(paths.less , ['compile-less']);
// });


gulp.task('compile-less', function () {
  gulp.src(paths.lessStyles)
      .pipe(less())
      .pipe(gulp.dest('./src/client/styles/css'));
});

gulp.task('minify-css', function() {
  var opts = {comments:true, spare:true};
  gulp.src(paths.CssStyles)
    .pipe(minifyCSS(opts))
    .pipe(gulp.dest('./dist/client/styles/'));
});

gulp.task('minify-js', function() {
  gulp.src(paths.scripts)
    .pipe(uglify())
    .pipe(gulp.dest('./dist/client/js/'));
});

gulp.task('copy-server-files', function () {
  gulp.src('./src/server/**/*')
    .pipe(gulp.dest('./dist/server/'));
});


gulp.task('connectDist', function (cb) {
  var called = false;
  return nodemon(nodemonDistConfig)
  .on('start', function () {
    if (!called) {
      called = true;
      cb();
    }
  })
  .on('restart', function () {
    setTimeout(function () {
      reload({ stream: false });
    }, 1000);
  });
});

gulp.task('watch', function() {
  gulp.watch(paths.scripts, ['lint']);
  gulp.watch(paths.lessStyles, ['compile-less']);
});

// *** default task *** //
// gulp.task('default', ['compile-less', 'browser-sync', 'watch'], function(){});
gulp.task('default', function() {
  runSequence(
    ['clean-css'],
    ['compile-less'],
    ['browser-sync', 'watch']
  );
});


// *** build task *** //
gulp.task('build', function() {
  runSequence(
    ['clean'],
    ['compile-less'],
    ['lint', 'minify-css', 'minify-js', 'copy-server-files', 'connectDist']
  );
});
