'use strict';

var gulp        = require('gulp');
var browserSync = require('browser-sync').create();

var compass = require('gulp-compass');
var plumber = require('gulp-plumber');
var autoprefixer = require('gulp-autoprefixer');

var useref = require('gulp-useref');
var gulpif = require('gulp-if');
var notify = require('gulp-notify');

var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');

var base = {
    src : './',
    dest : 'src/'
};

var config = {
    src: base.src + base.dest,
    sassSrc: base.src + base.dest + 'styles/sass/',
    watch: [
        base.src  + 'samples/**/*.html',
        base.src  + 'samples/**/*.css',
        base.src + 'samples/**/*.js'
    ]
};

// 注册compass 任务
// 合并雪碧图，autoprefixer, sass 编译
gulp.task('compass', function(){
    gulp.src(config.sassSrc + '*.scss')
        .pipe(plumber({
            errorHandler: function (error) {
                console.log(error.message);
                this.emit('end');
            }
        }))
        .pipe(compass({
            style: 'expanded',                  //nested, expanded, compact, compressed
            css: config.src + 'styles',
            sass: config.src + 'styles/sass',
            image: config.src + 'images'
        }))
        .on('error', function(err) {
            console.log(err);
        })
        .pipe(autoprefixer({
            browsers: ['> 5%'],
            // cascade: false
        }))
        .pipe(gulp.dest(config.src + 'styles'))
        .pipe(notify({message: '编译样式成功'}));
});

// Static server
gulp.task('dev', function() {
    browserSync.init({
        server: {
            baseDir: base.src,
            directory: true
        },
        open: 'external',
        logConnections: true,
        notify: false,
        ghostMode: false
    });
    gulp.watch(config.watch).on('change', browserSync.reload);
    gulp.watch(config.sassSrc + '*.scss', ['compass']);
});

//
gulp.task('jsmin', function(){
    return gulp.src([
            'dist/mu.js',
            'dist/mu.touch.js',
            'dist/mu.dialog.js',
            'dist/mu.slider.js',
            'dist/mu.page.js'
        ])
        .pipe(concat('./mu.latest.js'))
        .pipe(gulp.dest('dist/'))
        .pipe(uglify())
        .pipe(rename({
            extname: '.min.js'
        }))
        .pipe(gulp.dest('dist/'));
});

gulp.task('cssmin', function(){
    return gulp.src('src/styles/mu.css')
        .pipe(gulp.dest('dist/'))
        .pipe(minifyCss())
        .pipe(rename({
            extname: '.min.css'
        }))
        .pipe(gulp.dest('dist/'));
});

gulp.task('min', ['jsmin', 'cssmin']);

// 合并压缩JS & CSS
gulp.task('html', function(){
    var assets = useref.assets();

    return gulp.src(config.src + '*.html')
        .pipe(assets)
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', minifyCss()))
        .pipe(assets.restore())
        .pipe(useref())
        .pipe(gulp.dest(config.src + 'dist'));
});
// gulp.task('generate', ['html', 'copy']);