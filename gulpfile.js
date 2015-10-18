var watchify = require('watchify');
var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var assign = require('lodash').assign;
var browserSync = require('browser-sync').create();

// add custom browserify options here
var customOpts = {
    entries: ['./www/js/app.js'],
    debug: true,
    paths: ['./node_modules','./www/js/'],
    // poll: true
};
var opts = assign({}, watchify.args, customOpts);
var b = watchify(browserify(opts), {poll: true});

// so you can run `gulp js` to build the file
gulp.task('js', bundle);

// on any dep update, runs the bundler
b.on('update', bundle); 

// output build logs to terminal
b.on('log', function(msg){
    gutil.log(msg, this._options.entries);
});

function bundle() {
    return b.bundle()
        // log errors if they happen
        .on('error', function(msg){
            browserSync.notify("<span style='color:red;'>"+msg.toString()+"</span>", 15000);
            console.log(msg.toString());
            gutil.log('Browserify ', msg.toString());
        })
        .pipe(source('bundle.js'))
        // optional, remove if you don't need to buffer file contents
        .pipe(buffer())
        // optional, remove if you dont want sourcemaps
        .pipe(sourcemaps.init({
            loadMaps: true
        })) // loads map from browserify file
        // Add transformation tasks to the pipeline here.
        .pipe(sourcemaps.write('./')) // writes .map file
        .pipe(gulp.dest('./www/'))
        .pipe(browserSync.reload({stream:true, once: true}));
}

gulp.task('default', ['js'], function() {
    browserSync.init({
        server: {
            baseDir: "./www"
        }
    });

    gulp.watch("./www/**/*.js").on("change", bundle);
    gulp.watch("./www/*.html").on("change", browserSync.reload);
    gulp.watch("./www/assets/*").on("change", browserSync.reload);
    gulp.watch("./www/css/*").on("change", browserSync.reload);
});


