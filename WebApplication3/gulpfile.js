/// <binding BeforeBuild='default' />
"use strict";
var gulp = require("gulp");
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var del = require("del");
var minifyCSS = require("gulp-minify-css");
var bower = require("gulp-bower");
var sourcemaps = require("gulp-sourcemaps");
var tsc = require("gulp-tsc");

var taskNames = {
    clean_vendor_scripts: "clean-vendor-scripts",
    bower_restore: "bower-restore",
    default: "default",
    clean_styles: "clean-styles",
    vendor_scripts: "vendor-scripts",
    styles: "styles",
    css: "css",
    fonts: "fonts",
    jquery_bundle: "jquery-bundle", 
    bootstrap_bundle: "bootstrap-bundle",
    requirejs_bundle: "requirejs-bundle",
    knockout_bundle: "knockout-bundle",
    ts_bundle: "ts-bundle"
}

var commonConfigs = {
    scriptsDist: "Scripts/dist",
    jquerybundle: "jquery-bundle.min.js",
    bootstrapbundle: "bootstrap-bundle.min.js",
    requirejsbundle: "require-bundle.min.js",
    knockoutbundle: "knockout-bundle.min.js",
    tsbundle: "ts-bundle.min.js"
}

var config = {
    tssrc: [
        "scripts/ts/file1.ts"
    ],
    tsbundlepath: commonConfigs.scriptsDist + "/" + commonConfigs.tsbundle,

    requirejssrc: [
        "bower_components/requirejs/require.js",
        "scripts/require-setup.js"        
    ],
    requirejsbundlepath: commonConfigs.scriptsDist + "/" + commonConfigs.requirejsbundle,

    jquerysrc: [
        "bower_components/jquery/dist/jquery.min.js"
    ],
    jquerybundlepath: commonConfigs.scriptsDist + "/" + commonConfigs.jquerybundle,

    bootstrapsrc: [
        "bower_components/bootstrap/dist/js/bootstrap.min.js"
    ],    
    bootstrapbundlepath: commonConfigs.scriptsDist + "/" + commonConfigs.bootstrapbundle,

    knockoutsrc: [
        "bower_components/knockout/dist/knockout.js"
    ],
    knockoutbundlepath: commonConfigs.scriptsDist + "/" + commonConfigs.knockoutbundle,

    bootstrapcss: "bower_components/bootstrap/dist/css/bootstrap.css",
    boostrapfonts: "bower_components/bootstrap/dist/fonts/*.*",

    appcss: "Content/Site.css",
    fontsout: "Content/dist/fonts",
    cssout: "Content/dist/css"
}

gulp.task(taskNames.clean_vendor_scripts, function () {
    return del([
        config.jquerybundlepath,
        config.bootstrapbundlepath,
        config.requirejsbundlepath,
        config.knockoutbundlepath,
        config.tsbundlepath]);
});

gulp.task(taskNames.ts_bundle, [taskNames.clean_vendor_scripts, taskNames.bower_restore], function () {
    return gulp.src(config.tssrc)
     .pipe(tsc({ module: "amd" }))
     .pipe(uglify())
     .pipe(concat(commonConfigs.tsbundle))
     .pipe(gulp.dest(commonConfigs.scriptsDist));
});

gulp.task(taskNames.requirejs_bundle, [taskNames.clean_vendor_scripts, taskNames.bower_restore], function () {
    return gulp.src(config.requirejssrc)
     .pipe(uglify())
     .pipe(concat(commonConfigs.requirejsbundle))
     .pipe(gulp.dest(commonConfigs.scriptsDist));
});

gulp.task(taskNames.knockout_bundle, [taskNames.clean_vendor_scripts, taskNames.bower_restore], function () {
    return gulp.src(config.knockoutsrc)
     .pipe(uglify())
     .pipe(concat(commonConfigs.knockoutbundle))
     .pipe(gulp.dest(commonConfigs.scriptsDist));
});

gulp.task(taskNames.jquery_bundle, [taskNames.clean_vendor_scripts, taskNames.bower_restore], function () {
    return gulp.src(config.jquerysrc)
     .pipe(concat(commonConfigs.jquerybundle))
     .pipe(gulp.dest(commonConfigs.scriptsDist));
});

gulp.task(taskNames.bootstrap_bundle, [taskNames.clean_vendor_scripts, taskNames.bower_restore], function () {
    return gulp.src(config.bootstrapsrc)
     .pipe(concat(commonConfigs.bootstrapbundle))
     .pipe(gulp.dest(commonConfigs.scriptsDist));
});

gulp.task(taskNames.vendor_scripts, [
    taskNames.jquery_bundle,
    taskNames.bootstrap_bundle,
    taskNames.requirejs_bundle,
    taskNames.knockout_bundle,
    taskNames.ts_bundle], function () {
});

gulp.task(taskNames.clean_styles, function () {
    return del([config.fontsout, config.cssout]);
});

gulp.task(taskNames.css, [taskNames.clean_styles, taskNames.bower_restore], function () {
    return gulp.src([config.bootstrapcss, config.appcss])
     .pipe(minifyCSS())
     .pipe(concat("app.min.css"))
     .pipe(gulp.dest(config.cssout));
});

gulp.task(taskNames.fonts, [taskNames.clean_styles, taskNames.bower_restore], function () {
    return gulp.src(config.boostrapfonts)
        .pipe(gulp.dest(config.fontsout));
});

gulp.task(taskNames.styles, [taskNames.css, taskNames.fonts], function () {
});

gulp.task(taskNames.bower_restore, function () {
    return bower();
});

gulp.task(taskNames.default, [taskNames.vendor_scripts, taskNames.styles], function () {
});