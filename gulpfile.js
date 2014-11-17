var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    browserify = require('gulp-browserify'),
    concat = require('gulp-concat')
    del = require('del');

gulp.task('clean', function(cb) {
    del('lib/**/*.*', cb);
});

gulp.task('browserify', ['clean'], function(cb) {
    return gulp.src('./src/PathFinding.js')
    .pipe(browserify())
    .pipe(rename('pathfinding-browserified.js'))
    .pipe(gulp.dest('./lib/'), cb);
});

gulp.task('uglify', ['browserify'], function(cb) {
    return gulp.src('./lib/pathfinding-browserified.js')
    .pipe(uglify())
    .pipe(rename('pathfinding-browser.min.js'))
    .pipe(gulp.dest('./lib/'), cb);
});

gulp.task('scripts', ['clean', 'browserify', 'uglify'], function(cb) {
    return gulp.src(['./utils/banner', './lib/pathfinding-browserified.js'])
    .pipe(concat('pathfinding-browser.js'))
    .pipe(gulp.dest('./lib/'), cb);
});

gulp.task('compile', ['scripts'], function() {
    del('./lib/pathfinding-browserified.js');
});

gulp.task('default', ['compile'], function() {
});
