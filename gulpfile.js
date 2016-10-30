var gulp = require('gulp'),
	source = require('vinyl-source-stream'),
	buffer = require('vinyl-buffer');

var uglify = require('gulp-uglify'),
	babelify = require('babelify'),
	browserify = require('browserify'),
	sourcemaps = require('gulp-sourcemaps');


function bundle(bundler, filename) {
	return bundler
		.transform(babelify)
		.bundle()
		.on('error', function (err) { console.error(err.stack); })
		.pipe(source(filename))
		.pipe(buffer())
		// .pipe(sourcemaps.init({ loadMaps: true }))
		// .pipe(uglify()) // Use any gulp plugins you want now
		// .pipe(sourcemaps.write('.'))
}

gulp.task('pack', function () {
	var bundler = browserify({
		entries: './public/discussion/index.js',
		debug: true
	});

	return bundle(bundler, 'bundle.js')
		.pipe(gulp.dest('./public/discussion'));
});

gulp.task('dive', function() {
	var bundler = browserify({
		entries: './public/logicdive/index.js',
		debug: true
	});

	return bundle(bundler, 'bundle.js')
		.pipe(gulp.dest('./public'));
});
