﻿/// <reference path="../../typings/tsd.d.ts" />

requirejs.config(
    {
        shim: {
            "bootstrap": { "deps": ["jquery"] }
        },
        paths: {
            "jquery": "/Static/Scripts/dist/jquery-bundle.min",
            "bootstrap": "/Static/Scripts/dist/bootstrap-bundle.min",
            "knockout": "/Static/Scripts/dist/knockout-bundle.min"
        }
    });