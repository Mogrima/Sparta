var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var less = require('gulp-less');
var plumber = require('gulp-plumber');
var notify = require('gulp-notify');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var del = require('del');
var runSequence = require('run-sequence');

gulp.task('clean:dist', function() {
    return del('./dist/');
});

gulp.task('serve', function () {
    browserSync.init({
        server: {
            baseDir: './dist/'
        }
    });
    gulp.watch('src/**/*.html', ['html']);
    gulp.watch('src/less/**/*.less', ['less']);
    gulp.watch('src/js/**/*.js', ['copy:js']);
    gulp.watch('src/img/**/*.*', ['copy:img']);
});

gulp.task('html', function() {
    return gulp.src('./src/**/*.html')
    .pipe(gulp.dest('./dist/'))
    .pipe(browserSync.stream());
});

gulp.task('less', function () {
    return gulp.src('./src/less/style.less')
        .pipe(plumber({
            errorHandler: notify.onError(function (err) {
                return {
                    title: 'Styles',
                    message: err.message
                };
            })
        }))
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(autoprefixer({
            browsers: ['last 3 versions'],
            cascade: false
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./dist/css/'))
        .pipe(browserSync.stream());
});

gulp.task('copy:js', function() {
    return gulp.src('./src/js/**/*.*')
    .pipe(gulp.dest('./dist/js/'))
    .pipe(browserSync.stream());
});

gulp.task('copy:img', function() {
    return gulp.src('./src/img/**/*.*')
    .pipe(gulp.dest('./dist/img/'))
    .pipe(browserSync.stream());
});

gulp.task('copy:fonts', function() {
    return gulp.src('./src/fonts/**/*.*')
    .pipe(gulp.dest('./dist/fonts/'))
    .pipe(browserSync.stream());
});

gulp.task('default', function(callback) {
    runSequence(
        'clean:dist',
        ['less', 'html', 'copy:js', 'copy:img', 'copy:fonts'],
        'serve',
        callback
    );
});