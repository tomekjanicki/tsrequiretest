/// <reference path="../../typings/tsd.d.ts" />
requirejs.config({
    shim: {
        "bootstrap": { "deps": ["jquery"] }
    },
    paths: {
        "jquery": "/Scripts/dist/jquery-bundle.min",
        "bootstrap": "/Scripts/dist/bootstrap-bundle.min",
        "knockout": "/Scripts/dist/knockout-bundle.min"
    }
});
