/**
 * Module Dependencies
 */

var gulp = require('gulp');
var babel = require('gulp-babel');
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
var useref = require('gulp-useref');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');


/**
 * Config
 */

var paths = {
  CssStyles: [
    './src/client/styles/css/main.css'
  ],
  lessStyles: [
    './src/client/styles/less/*.less'
  ],
  scripts: [
    './src/client/js/*.js',
    './src/client/js/**/*.js'
  ],
  server: './src/server/bin/www',
  distServer: './dist/server/bin/www'
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
  return gulp.src('./dist')
    .pipe(clean({force: true}));
});

gulp.task('clean-css', function() {
  return gulp.src('./src/client/styles/css/*.css')
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
  return gulp.src(paths.lessStyles)
      .pipe(less())
      .pipe(gulp.dest('./src/client/styles/css'));
});

// gulp.task('compile-less', function () {
//   return gulp.src(paths.lessStyles)
//       .pipe(less())
//       .pipe(gulp.dest('./dist/client/less/'));
// });

gulp.task('minify-css', function() {
  var opts = {comments:true, spare:true};
  return gulp.src(paths.CssStyles)
    .pipe(minifyCSS(opts))
    .pipe(gulp.dest('./dist/client/styles/css'));
});

gulp.task('minify-js', function() {
  return gulp.src(paths.scripts)
    .pipe(uglify())
    .pipe(gulp.dest('./dist/client/js'));
});

gulp.task('copy-server-files', function () {
  return gulp.src('./src/server/**/*')
    .pipe(gulp.dest('./dist/server/'));
});

//someday I'll get this working, in the meantime, just kill me.

// gulp.task('es6', function(){
//   return gulp.src(paths.scripts)
//     .pipe(babel({ presets: ['es2015'] }))
//     .pipe(gulp.dest('./dist/client/js'));
// });

// gulp.task('es6', function(){
//  return gulp.src(paths.scripts)
//     .pipe(browserify({entries: './src/client/js/**', debug: true}))
//     .transform("babelify", { presets: ["es2015"] })
//     .bundle()
//     .pipe(source('./src/client/js/**'))
//     .pipe(gulp.dest('./dist/js'));
// });

gulp.task('useref', function(){
  return gulp.src('src/client/index.html')
      .pipe(useref())
      .pipe(gulp.dest('dist/client'));
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
  // gulp.watch(paths.scripts, ['lint']);
  gulp.watch(paths.lessStyles, ['clean-css', 'compile-less']);
});

// *** default task *** //
// gulp.task('default', ['compile-less', 'browser-sync', 'watch'], function(){});
gulp.task('default', function() {
  runSequence(
    'clean',
    'clean-css',
    'compile-less',
    ['browser-sync', 'watch']
  );
});


// // *** build task *** //
// gulp.task('build', function() {
//   runSequence(
//     ['clean'],
//     ['compile-less'],
//     ['lint', 'minify-css', 'minify-js', 'copy-server-files', 'connectDist']
//   );
// });

// *** build task *** //
gulp.task('build', function() {
  runSequence('clean', 'clean-css', 'compile-less', 'minify-css', 'useref', 'connectDist');
});
