/// <reference path="../../../../typings/tsd.d.ts" />

import TestVm = require("./TestVm");
import jQuery = require("jquery");
import ko = require("knockout");

require(["bootstrap"], () => {
    jQuery(document).ready(() => {
        jQuery("#jqueryButton").click(() => {
            window.alert("Alert from jquery");
        });
    });

    ko.applyBindings(new TestVm());
})