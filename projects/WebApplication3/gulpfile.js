/// <binding BeforeBuild='default' />
"use strict";
var gulp = require("gulp");
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var del = require("del");
var minifyCSS = require("gulp-minify-css");
var bower = require("gulp-bower");
var sourcemaps = require("gulp-sourcemaps");
var ts = require("gulp-typescript");
var amdOptimize = require("gulp-amd-optimizer");
var merge = require("gulp-merge");
var tap = require("gulp-tap");
var sourcemaps = require("gulp-sourcemaps");

var taskNames = {
    clean_vendor_scripts: "clean-vendor-scripts",
    bower_restore: "bower-restore",
    default: "default",
    clean_styles: "clean-styles",
    vendor_scripts: "vendor-scripts",
    styles: "styles",
    css: "css",
    fonts: "fonts",
    shared_bundle: "shared-bundle",
    requirejs_bundle: "requirejs-bundle",
    ts_compile: "ts_compile"
}

var commonConfigs = {
    scripts: "static/scripts/dist",
    requirejsbundle: "require-bundle.min.js",
    sharedbundle: "shared.min.js",
    cssbundle: "app.min.css",
    tssourcepath: "static/scripts/ts",
    tsdestpath: "static/scripts/dist",
    bowerFolder: "bower_components",
    sourcemap: "./"
}

var requireConfig = {
    baseUrl: "",
    paths: {
        "jquery": commonConfigs.bowerFolder + "/jquery/dist/jquery",
        "knockout": commonConfigs.bowerFolder + "/knockout/dist/knockout.debug"
    },
    exclude: [
        "exports",
        "require",
        "bootstrap"
    ]
};

var options = {
    umd: true
};

var shimConfig = {
    "bower_components/bootstrap/dist/js/bootstrap.js": {
        "header": "define(\"bootstrap\", [], function() {",
        "footer": "});"
    }
};

var config = {
    tssrc: [
        commonConfigs.tssourcepath + "/**/*.ts"
    ],
    tsdest: commonConfigs.tsdestpath + "/**/*.js",

    requirejssrcjs: [
        "static/scripts/js/requireconfig.js",
        commonConfigs.bowerFolder + "/requirejs/require.js"
    ],
    requirejsbundlepath: commonConfigs.scripts + "/" + commonConfigs.requirejsbundle,

    dummyscript: "static/scripts/js/dummy.js",

    sharedbundlepath: commonConfigs.scripts + "/" + commonConfigs.sharedbundle,

    bootstrapcss: commonConfigs.bowerFolder + "/bootstrap/dist/css/bootstrap.css",
    boostrapfonts: commonConfigs.bowerFolder + "/bootstrap/dist/fonts/*.*",

    appcss: "static/content/src/site.css",
    fontsout: "static/content/dist/fonts",
    cssout: "static/content/dist/css",
    tsconfig: "static/scripts/ts/tsconfig.json"
}

gulp.task(taskNames.clean_vendor_scripts, function () {
    return del([
        config.sharedbundlepath,
        config.requirejsbundlepath,
        config.tsdest
    ]);
});

gulp.task(taskNames.ts_compile, [taskNames.clean_vendor_scripts, taskNames.bower_restore], function () {
    var tsProject = ts.createProject(config.tsconfig);
    return gulp.src(config.tssrc)
     .pipe(ts(tsProject))
     .pipe(uglify())
     .pipe(gulp.dest(commonConfigs.tsdestpath));
});

gulp.task(taskNames.requirejs_bundle, [taskNames.clean_vendor_scripts, taskNames.bower_restore], function () {
    return gulp.src(config.requirejssrcjs)
     .pipe(sourcemaps.init())
     .pipe(uglify())
     .pipe(concat(commonConfigs.requirejsbundle))
     .pipe(sourcemaps.write(commonConfigs.sourcemap))
     .pipe(gulp.dest(commonConfigs.scripts));
});

gulp.task(taskNames.shared_bundle, [taskNames.clean_vendor_scripts, taskNames.bower_restore], function () {
    return merge(
        gulp.src(Object.keys(shimConfig).map(function (shimItem) { return shimItem }))
        .pipe(tap(function (file) {
            var relativePath = file.path.substring(file.path.lastIndexOf(commonConfigs.bowerFolder)).replace(/\\/g, "/");
            var header = shimConfig[relativePath].header;
            var footer = shimConfig[relativePath].footer;
            var content = file.contents.toString();
            file.contents = Buffer.concat([new Buffer(header), new Buffer(content), new Buffer(footer)]);
        })),
        gulp.src(config.dummyscript, { base: requireConfig.baseUrl }).pipe(amdOptimize(requireConfig, options))
     )
     .pipe(sourcemaps.init())
     .pipe(uglify())
     .pipe(concat(commonConfigs.sharedbundle))
     .pipe(sourcemaps.write(commonConfigs.sourcemap))
     .pipe(gulp.dest(commonConfigs.scripts));
});

gulp.task(taskNames.vendor_scripts, [
    taskNames.shared_bundle,
    taskNames.requirejs_bundle,
    taskNames.ts_compile
], function () {
});

gulp.task(taskNames.clean_styles, function () {
    return del([config.fontsout, config.cssout]);
});

gulp.task(taskNames.css, [taskNames.clean_styles, taskNames.bower_restore], function () {
    return gulp.src([config.bootstrapcss, config.appcss])
     .pipe(sourcemaps.init())
     .pipe(minifyCSS())
     .pipe(concat(commonConfigs.cssbundle))
     .pipe(sourcemaps.write(commonConfigs.sourcemap))
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