var gulp = require('gulp'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer');

var uglify = require('gulp-uglify'),
    babelify = require('babelify'),
    browserify = require('browserify'),
    sourcemaps = require('gulp-sourcemaps');

gulp.task('pack', function () {
    var bundler = browserify({
        entries: './example/index.js',
        debug: true
    });
    
    bundler.transform(babelify);

    bundler.bundle()
        .on('error', function (err) { console.error(err.stack); })
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(uglify()) // Use any gulp plugins you want now
        .pipe(sourcemaps.write('./example'))
        .pipe(gulp.dest('./example'));
});