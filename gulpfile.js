var gulp = require('gulp'),
	source = require('vinyl-source-stream'),
	buffer = require('vinyl-buffer');

var uglify = require('gulp-uglify'),
	babelify = require('babelify'),
	browserify = require('browserify'),
	sourcemaps = require('gulp-sourcemaps');

gulp.task('pack', function () {
	gulp.src('./node_modules/three/three.js')
		.pipe(gulp.dest('./example'));

	var bundler = browserify({
		entries: './example/index.js',
		debug: true
	});

	bundler.transform(babelify);

	return bundler.bundle()
		.on('error', function (err) { console.error(err.stack); })
		.pipe(source('bundle.js'))
		.pipe(buffer())
		.pipe(sourcemaps.init({ loadMaps: true }))
		.pipe(uglify()) // Use any gulp plugins you want now
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('./example'));
});