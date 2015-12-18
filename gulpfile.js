// Get things set up
// -------------------------------------------------------------------

// Include Gulp
var gulp = require("gulp"),

// HTML plugins
    fileinclude = require("gulp-file-include"),
    htmlmin = require("gulp-htmlmin"),

// CSS plugins
    sass = require("gulp-sass"),
    autoprefixer = require("gulp-autoprefixer"),
    cssmin = require("gulp-minify-css"),
    uncss = require("gulp-uncss"),
    rename = require("gulp-rename"),
    globber = require('glob'),

// JS plugins
    concat = require("gulp-concat"),
    uglify = require("gulp-uglify"),

// Image plugin
    imagemin = require("gulp-imagemin"),

// General plugins
    gutil = require("gulp-util"),
    plumber = require("gulp-plumber"),
    size = require("gulp-size"),
    watch = require("gulp-watch"),
    deploy = require('gulp-gh-pages'),
    browserSync = require("browser-sync"),
    browserify = require('gulp-browserify');
reload = browserSync.reload;

// Tasks
// -------------------------------------------------------------------

// Start server
// Note: Replace `localhost` in the browser URL with your system's
// internal IP (something like 192.168.32.20) and then you'll be able
// to go to that address on multiple devices and all reloading,
// scrolling, clicking, etc will be synced across everything.
gulp.task("browser-sync", function () {
    browserSync({
        server: {
            baseDir: "dist"
        }
    });
});

// Notify on error with a beep
var onError = function (error) {
    console.log(gutil.colors.red(error.message));
    // https://github.com/floatdrop/gulp-plumber/issues/17
    this.emit("end");
    gutil.beep();
};

// HTML task
gulp.task("html", function () {
    return gulp.src("src/html/*.html")
        // Prevent gulp.watch from crashing
        .pipe(plumber(onError))
        // Set up HTML templating
        .pipe(fileinclude({
            prefix: "@@",
            basepath: "src/html"
        }))
        // Clean up HTML a little
        .pipe(htmlmin({
            removeCommentsFromCDATA: true,
            removeRedundantAttributes: true,
            removeEmptyAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true,
            caseSensitive: true,
            minifyCSS: true
        }))
        // Where to store the finalized HTML
        .pipe(gulp.dest("dist"));
});

// CSS task
gulp.task("css", function () {
    return gulp.src("src/scss/main.scss")
        // Prevent gulp.watch from crashing
        .pipe(plumber(onError))
        // Compile Sass
        .pipe(sass({style: "compressed", noCache: true}))
        // parse CSS and add vendor-prefixed CSS properties
        .pipe(autoprefixer({
            browsers: ["> 5%", "last 2 versions", "Firefox ESR"],
            cascade: false
        }))
        // Minify CSS
        .pipe(cssmin())
        // Rename the file
        .pipe(rename("production.css"))
        // Show sizes of minified CSS files
        .pipe(size({showFiles: true}))
        // Where to store the finalized CSS
        .pipe(gulp.dest("dist/css"));
});

// Unused CSS task
gulp.task("unused-css", function () {
    return gulp.src("dist/css/*.css")
        // Prevent gulp.watch from crashing
        .pipe(plumber(onError))
        // Remove any CSS that isn't being used
        .pipe(uncss({
            // Target all the HTML files in the dist directory
            html: globber.sync("dist/**/*.html"),
            // Keep some JS dependent CSS from being deleted,
            // this is an example, configure as needed
            ignore: [
                ".js"
            ]
        }))
        // Minify CSS
        .pipe(cssmin())
        // Show sizes of minified CSS files
        .pipe(size({showFiles: true}))
        // Where to store the finalized CSS
        .pipe(gulp.dest("dist/css"));
});

// JS task
gulp.task('browserify', function () {
    return gulp.src(['src/js/main.js'], {read: false})
        // Browserify, and add source maps if this isn't a production build
        .pipe(browserify())
        // Rename the destination file
        .pipe(rename('production.js'))
         // Minify JS
        //.pipe(uglify())
        // Output to the build directory
        .pipe(gulp.dest('dist/js'));
});


// Image task
gulp.task("images", function () {
    return gulp.src("src/img/**/*.+(png|jpeg|jpg|gif|svg)")
        // Prevent gulp.watch from crashing
        .pipe(plumber(onError))
        // Minify the images
        .pipe(imagemin())
        // Where to store the finalized images
        .pipe(gulp.dest("dist/img"));
});

// Push build to gh-pages
gulp.task('deploy', ['html', 'css', 'unused-css', 'browserify', 'images'], function () {
    return gulp.src("./dist/**/*")
        .pipe(deploy())
});

// Use default task to launch BrowserSync and watch all files
gulp.task("default", ["browser-sync"], function () {
    // All browsers reload after tasks are complete
    // Watch HTML files
    watch("src/html/**/*", function () {
        gulp.start("html", reload);
    });
    // Watch Sass files
    watch("src/scss/**/*", function () {
        gulp.start('css', reload);
    });
    // Watch JS files
    watch("src/js/**/*", function () {
        gulp.start("browserify", reload);
    });
    // Watch image files
    watch("src/img/**/*.+(png|jpeg|jpg|gif|svg)", function () {
        gulp.start("images", reload);
    });
});