/// <reference path="../../typings/tsd.d.ts" />

requirejs.config(
    {
        shim: {
            "bootstrap": { "deps": ["jquery"] }
        },
        paths: {
            "jquery": "Static/Scripts/js/jquery-bundle.min",
            "bootstrap": "Static/Scripts/js/bootstrap-bundle.min",
            "knockout": "Static/Scripts/js/knockout-bundle.min"
        }
    });