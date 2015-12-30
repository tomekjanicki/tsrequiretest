/// <reference path="../../../../typings/tsd.d.ts" />

import TestVm = require("./TestVm");
import $ = require("jquery");
import ko = require("knockout");

require(["bootstrap"], () => {
    $(() => {
        $("#jqueryButton").click(() => {
            window.alert("Alert from jquery");
        });
    });

    ko.applyBindings(new TestVm());
})