var gulp = require('gulp')

var browserify = require('gulp-browserify');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var del = require('del');

gulp.task('bundle', function() {
    return gulp.src('lib/index.js')
    .pipe(browserify({
        standalone: "rousseau",
        insertGlobals : true,
        debug : false
    }))
    .pipe(rename('rousseau.js'))
    .pipe(gulp.dest('./dist'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('./dist'));
});

gulp.task('clean', function(cb) {
    del(['dist'], cb)
});

gulp.task('default', ['clean'], function() {
    return gulp.start('bundle');
});
