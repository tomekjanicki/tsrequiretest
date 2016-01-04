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
    scripts: "static/scripts/dist",
    jquerybundle: "jquery-bundle.min.js",
    bootstrapbundle: "bootstrap-bundle.min.js",
    requirejsbundle: "require-bundle.min.js",
    knockoutbundle: "knockout-bundle.min.js",
    cssbundle: "app.min.css",
    tssourcepath: "static/scripts/ts",
    tsdestpath: "static/scripts/dist"
}

var config = {
    tssrc: [
        commonConfigs.tssourcepath + "/**/*.ts"
    ],
    tsdest: commonConfigs.tsdestpath + "/**/*.js",

    requirejssrcjs: [
        "static/scripts/js/requireconfig.js",
        "bower_components/requirejs/require.js"        
    ],
    requirejsbundlepath: commonConfigs.scripts + "/" + commonConfigs.requirejsbundle,

    jquerysrc: [
        "bower_components/jquery/dist/jquery.min.js"
    ],
    jquerybundlepath: commonConfigs.scripts + "/" + commonConfigs.jquerybundle,

    bootstrapsrc: [
        "bower_components/bootstrap/dist/js/bootstrap.min.js"
    ],    
    bootstrapbundlepath: commonConfigs.scripts + "/" + commonConfigs.bootstrapbundle,

    knockoutsrc: [
        "bower_components/knockout/dist/knockout.js"
    ],
    knockoutbundlepath: commonConfigs.scripts + "/" + commonConfigs.knockoutbundle,

    bootstrapcss: "bower_components/bootstrap/dist/css/bootstrap.css",
    boostrapfonts: "bower_components/bootstrap/dist/fonts/*.*",

    appcss: "static/content/src/site.css",
    fontsout: "static/content/dist/fonts",
    cssout: "static/content/dist/css",
    tsconfig: "static/scripts/ts/tsconfig.json"
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
    var tsProject = ts.createProject(config.tsconfig);
    return gulp.src(config.tssrc)
     .pipe(ts(tsProject))
     .pipe(uglify())
     .pipe(gulp.dest(commonConfigs.tsdestpath));
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
    taskNames.knockout_bundle,
    taskNames.ts_compile
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

var requireConfig = {
    baseUrl: "",
    paths: {
        "jquery": "bower_components/jquery/dist/jquery",
        "knockout": "bower_components/knockout/dist/knockout.debug"
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

var shimConfig =
    {
        "bower_components/bootstrap/dist/js/bootstrap.js": {
            "header": "define(\"bootstrap\", [], function() {",
            "footer": "});"
        }
    }

gulp.task("test", function () {
    return merge(
        gulp.src(Object.keys(shimConfig).map(function(shimItem) {return shimItem}))
        .pipe(tap(function(file) {
            var relativePath = file.path.substring(file.path.lastIndexOf("bower_components")).replace(/\\/g, "/");
            var header = shimConfig[relativePath].header;
            var footer = shimConfig[relativePath].footer;
            var content = file.contents.toString();
            file.contents = Buffer.concat([new Buffer(header), new Buffer(content), new Buffer(footer)]);
        })),
        gulp.src("static/scripts/js/dummy.js", { base: requireConfig.baseUrl }).pipe(amdOptimize(requireConfig, options))
     )
     .pipe(concat("shared.js"))
     .pipe(uglify())
     .pipe(gulp.dest("static/scripts/dist/"));
})