var gulp = require('gulp');
var sass = require('gulp-sass');
var jade = require('gulp-jade');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var browserSync = require('browser-sync').create();
var inline = require('gulp-inline');
var svgmin = require('gulp-svgmin');
var runSequence = require('run-sequence');
var cssnano = require('gulp-cssnano');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var del = require('del');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var spritesmith = require('gulp.spritesmith');
var merge = require('merge-stream');
var replace = require('gulp-replace');

gulp.task('sass', function(){
    return gulp.src('scss/style.scss')
        .pipe(sass({
            outputStyle: 'expanded'
        }))
        .pipe(postcss([
            autoprefixer({
                browsers: ['> 0%']
            })
        ]))
        .pipe(replace('sprite.png', '../img/sprite/sprite.png'))
        .pipe(cssnano({zindex: false}))
        .pipe(gulp.dest('../prod/css'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

gulp.task('jade', function(){
    return gulp.src('*.jade')
        .pipe(jade({
            pretty: true
        }))
        .pipe(gulp.dest('../prod'));
});

gulp.task('inline', function(){
    return gulp.src('../prod/*.html')
        .pipe(inline({
            base: 'img/svg',
            disabledTypes: ['js', 'css', 'img'],
            ignore: ['css', 'js', 'fonts']
        }))
        .pipe(gulp.dest('../prod'));
});

gulp.task('svgmin', function () {
    return gulp.src('img/svg/*.svg')
        .pipe(svgmin({
            js2svg: {
                pretty: true
            }
        }))
        .pipe(gulp.dest('img/svg'));
});

gulp.task('reload', function(){
    return gulp.src('../prod/*.html')
        .pipe(browserSync.reload({
            stream: true
        }))
});

gulp.task('scripts', function() {
    gulp.src([
        'js/**/*.js',
        'bower_components/underscore/underscore-min.js',
        'bower_components/clipboard/dist/clipboard.min.js',
        'bower_components/jquery/dist/jquery.min.js'
    ])
    // .pipe(concat('all.js'))
    .pipe(uglify())
    .pipe(gulp.dest('../prod/js'))
    .pipe(browserSync.reload({
        stream: true
    }))
});

gulp.task('clean:js', function() {
    return del.sync(['../prod/js/*.js'], {'force': true});
});

gulp.task('images', function(){
    gulp.src('img/*.+(png|jpg|gif)')
        .pipe(cache(imagemin()))
        .pipe(gulp.dest('../prod/img'))
});

gulp.task('fonts', function(){
    gulp.src('fonts/*')
        .pipe(gulp.dest('../prod/fonts'))
});

gulp.task('sprite', function () {
    var spriteData = gulp.src('img/sprite/*.png').pipe(spritesmith({
        imgName: 'sprite.png',
        cssName: '_sprite.scss'
    }));

    var imgStream = spriteData.img
        .pipe(gulp.dest('../prod/img/sprite'));

    var cssStream = spriteData.css
        .pipe(gulp.dest('scss/components'));

    return merge(imgStream, cssStream);
});

gulp.task('watch', ['clean:js', 'browserSync', 'jade', 'sass', 'inline', 'scripts', 'svgmin', 'images', 'fonts', 'sprite'], function(){
    gulp.watch('**/*.scss', ['sass']);
    gulp.watch('img/*.+(png|jpg|gif)', ['images']);
    gulp.watch('img/sprite/*', ['sprite']);
    gulp.watch('fonts/*', ['fonts']);
    gulp.watch('**/*.jade', function() {
        runSequence('jade', 'svgmin', 'inline', 'reload');
    });
    gulp.watch('js/*.js', ['scripts']);
});

gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: '../prod',
            index: 'index.html'
        }
    })
});