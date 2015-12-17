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
    ts_compile: "ts_compile"
}

var commonConfigs = {
    scripts: "/Static/Scripts/js",
    jquerybundle: "jquery-bundle.min.js",
    bootstrapbundle: "bootstrap-bundle.min.js",
    requirejsbundle: "require-bundle.min.js",
    knockoutbundle: "knockout-bundle.min.js",
    cssbundle: "app.min.css",
    tspath: "/static/scripts/ts/views/**"
}

var config = {
    tssrc: [
        commonConfigs.tspath + "/" + "*.ts"
    ],
    tsdest: commonConfigs.tspath + "/" + "*.js",

    requirejssrcjs: [
        "/bower_components/requirejs/require.js"
    ],
    requirejssrcts: [
        "/static/scripts/ts/App_Start/requiresetup.ts"
    ],
    requirejsbundlepath: commonConfigs.scripts + "/" + commonConfigs.requirejsbundle,

    jquerysrc: [
        "/bower_components/jquery/dist/jquery.min.js"
    ],
    jquerybundlepath: commonConfigs.scripts + "/" + commonConfigs.jquerybundle,

    bootstrapsrc: [
        "/bower_components/bootstrap/dist/js/bootstrap.min.js"
    ],    
    bootstrapbundlepath: commonConfigs.scripts + "/" + commonConfigs.bootstrapbundle,

    knockoutsrc: [
        "/bower_components/knockout/dist/knockout.js"
    ],
    knockoutbundlepath: commonConfigs.scripts + "/" + commonConfigs.knockoutbundle,

    bootstrapcss: "/bower_components/bootstrap/dist/css/bootstrap.css",
    boostrapfonts: "/bower_components/bootstrap/dist/fonts/*.*",

    appcss: "/Static/Content/src/Site.css",
    fontsout: "/Static/Content/dist/fonts",
    cssout: "/Static/Content/dist/css"
}

gulp.task(taskNames.clean_vendor_scripts, function () {
    return del([
        config.jquerybundlepath,
        config.bootstrapbundlepath,
        config.requirejsbundlepath,
        config.knockoutbundlepath,
        config.tsdest
    ]);
});

gulp.task(taskNames.ts_compile, [taskNames.clean_vendor_scripts, taskNames.bower_restore], function () {
    return gulp.src(config.tssrc)
     .pipe(tsc({ module: "amd" }))
     .pipe(uglify())
     .pipe(gulp.dest(config.tsdest));
});

gulp.task(taskNames.requirejs_bundle, [taskNames.clean_vendor_scripts, taskNames.bower_restore], function () {
    return gulp.src(config.requirejssrcjs)
     .pipe(uglify())
     .pipe(concat(commonConfigs.requirejsbundle))
     .pipe(gulp.dest(commonConfigs.scripts));
});

gulp.task(taskNames.knockout_bundle, [taskNames.clean_vendor_scripts, taskNames.bower_restore], function () {
    return gulp.src(config.knockoutsrc)
     .pipe(uglify())
     .pipe(concat(commonConfigs.knockoutbundle))
     .pipe(gulp.dest(commonConfigs.scripts));
});

gulp.task(taskNames.jquery_bundle, [taskNames.clean_vendor_scripts, taskNames.bower_restore], function () {
    return gulp.src(config.jquerysrc)
     .pipe(concat(commonConfigs.jquerybundle))
     .pipe(gulp.dest(commonConfigs.scripts));
});

gulp.task(taskNames.bootstrap_bundle, [taskNames.clean_vendor_scripts, taskNames.bower_restore], function () {
    return gulp.src(config.bootstrapsrc)
     .pipe(concat(commonConfigs.bootstrapbundle))
     .pipe(gulp.dest(commonConfigs.scripts));
});

gulp.task(taskNames.vendor_scripts, [
    taskNames.jquery_bundle,
    taskNames.bootstrap_bundle,
    taskNames.requirejs_bundle,
    taskNames.knockout_bundle//,
    //taskNames.ts_bundle
], function () {
});

gulp.task(taskNames.clean_styles, function () {
    return del([config.fontsout, config.cssout]);
});

gulp.task(taskNames.css, [taskNames.clean_styles, taskNames.bower_restore], function () {
    return gulp.src([config.bootstrapcss, config.appcss])
     .pipe(minifyCSS())
     .pipe(concat(commonConfigs.cssbundle))
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